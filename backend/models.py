from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    last_check_in = Column(DateTime(timezone=True), server_default=func.now())
    check_in_frequency_days = Column(Integer, default=30)
    is_emergency_mode = Column(Boolean, default=False)

    configs = relationship("UserConfig", back_populates="owner")
    assets = relationship("Asset", back_populates="owner")
    beneficiaries = relationship("Beneficiary", back_populates="owner")

class Beneficiary(Base):
    __tablename__ = "beneficiaries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, index=True)
    relation = Column(String)
    can_access_photos = Column(Boolean, default=False)
    can_access_docs = Column(Boolean, default=False)
    can_access_messages = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="beneficiaries")

class UserConfig(Base):
    __tablename__ = "user_configs"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, index=True)
    value = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="configs")

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    category = Column(String, index=True)
    details = Column(Text)
    object_name = Column(String)
    file_name = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="assets")

# Add the assets relationship to User model explicitly if not already handled
User.assets = relationship("Asset", back_populates="owner")
