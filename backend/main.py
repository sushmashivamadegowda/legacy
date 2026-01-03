from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from jose import JWTError, jwt
import os

from . import models, database, s3_utils, auth_utils, schemas
from .database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Legacy Digital (Production Mode)")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, set this to your specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, auth_utils.SECRET_KEY, algorithms=[auth_utils.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.username == token_data.username).first()
    if user is None:
        raise credentials_exception
    return user

@app.get("/")
def read_root():
    return {"message": "Legacy Digital Production API"}

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth_utils.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth_utils.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = auth_utils.get_password_hash(user.password)
    new_user = models.User(username=user.username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/upload")
async def upload_asset(
    title: str = Form(...),
    category: str = Form(...),
    details: str = Form(""),
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    content = await file.read()
    import time
    object_name = f"user_{current_user.id}/{category}/{int(time.time())}_{file.filename}"
    
    success = s3_utils.upload_file_to_s3(content, object_name)
    if not success:
        raise HTTPException(status_code=500, detail="S3 upload failed")
        
    db_asset = models.Asset(
        title=title,
        category=category,
        details=details,
        object_name=object_name,
        file_name=file.filename,
        user_id=current_user.id
    )
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return {"message": "Upload successful", "id": db_asset.id}

@app.get("/assets/{category}", response_model=List[schemas.Asset])
def get_assets(
    category: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(models.Asset).filter(
        models.Asset.category == category, 
        models.Asset.user_id == current_user.id
    ).all()

@app.get("/assets/{asset_id}/view")
def get_asset_view_url(
    asset_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    asset = db.query(models.Asset).filter(
        models.Asset.id == asset_id,
        models.Asset.user_id == current_user.id
    ).first()
    
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    url = s3_utils.get_presigned_url(asset.s3_key)
    if not url:
        raise HTTPException(status_code=500, detail="Could not generate access URL")
    
    return {"url": url}

@app.get("/user/stats")
def get_user_stats(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Calculate counts for dashboard cards
    categories = ['photosvids', 'chromepass', 'gdrive', 'messages', 'passvault', 'whatsapp']
    stats = {}
    for cat in categories:
        count = db.query(models.Asset).filter(
            models.Asset.category == cat,
            models.Asset.user_id == current_user.id
        ).count()
        stats[cat] = count
    
    # Count beneficiaries separately
    stats['beneficiaries'] = db.query(models.Beneficiary).filter(
        models.Beneficiary.user_id == current_user.id
    ).count()
    return stats

@app.get("/beneficiaries", response_model=List[schemas.Beneficiary])
def list_beneficiaries(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.Beneficiary).filter(models.Beneficiary.user_id == current_user.id).all()

@app.post("/beneficiaries", response_model=schemas.Beneficiary)
def add_beneficiary(beneficiary: schemas.BeneficiaryCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_beneficiary = models.Beneficiary(**beneficiary.dict(), user_id=current_user.id)
    db.add(db_beneficiary)
    db.commit()
    db.refresh(db_beneficiary)
    return db_beneficiary

@app.delete("/beneficiaries/{beneficiary_id}")
def delete_beneficiary(beneficiary_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_beneficiary = db.query(models.Beneficiary).filter(
        models.Beneficiary.id == beneficiary_id, 
        models.Beneficiary.user_id == current_user.id
    ).first()
    if not db_beneficiary:
        raise HTTPException(status_code=404, detail="Beneficiary not found")
    db.delete(db_beneficiary)
    db.commit()
    return {"message": "Beneficiary removed"}

@app.patch("/beneficiaries/{beneficiary_id}/toggle/{perm_type}")
def toggle_beneficiary_permission(beneficiary_id: int, perm_type: str, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_beneficiary = db.query(models.Beneficiary).filter(
        models.Beneficiary.id == beneficiary_id, 
        models.Beneficiary.user_id == current_user.id
    ).first()
    if not db_beneficiary:
        raise HTTPException(status_code=404, detail="Beneficiary not found")
    
    attr = f"can_access_{perm_type}"
    if hasattr(db_beneficiary, attr):
        current_val = getattr(db_beneficiary, attr)
        setattr(db_beneficiary, attr, not current_val)
        db.commit()
        db.refresh(db_beneficiary)
        return db_beneficiary
    raise HTTPException(status_code=400, detail="Invalid permission type")
