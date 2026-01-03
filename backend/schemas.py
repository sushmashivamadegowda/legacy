from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    last_check_in: datetime
    check_in_frequency_days: int
    is_emergency_mode: bool
    
    class Config:
        from_attributes = True

class BeneficiaryBase(BaseModel):
    name: str
    email: str
    relation: str
    can_access_photos: bool = False
    can_access_docs: bool = False
    can_access_messages: bool = False

class BeneficiaryCreate(BeneficiaryBase):
    pass

class Beneficiary(BeneficiaryBase):
    id: int
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class AssetBase(BaseModel):
    title: str
    category: str
    details: Optional[str] = None

class AssetCreate(AssetBase):
    pass

class Asset(AssetBase):
    id: int
    object_name: str
    file_name: str
    
    class Config:
        from_attributes = True
