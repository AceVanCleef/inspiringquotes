from contextlib import asynccontextmanager
import os
from fastapi import FastAPI
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from sqlalchemy import create_engine

# 1. The  URL
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "sqlite:///./inspiring_quotes.db"
)

# Wichtig: Psycopg 3 braucht das "+psycopg" im String
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

# SQLite braucht ein spezielles Argument, Postgres nicht
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

# 2. The Engine
engine = create_engine(DATABASE_URL, connect_args=connect_args)

# 3. The modern way to declare base
class Base(DeclarativeBase):
    pass  # Diese Klasse dient nur als "Anker" für deine Modelle

# 4. Session-Factory
SessionLocal = sessionmaker(bind=engine)