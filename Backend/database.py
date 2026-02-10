from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy import create_engine

# 1. The  URL
DATABASE_URL = "sqlite:///./inspiring_quotes.db"

# 2. The Engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# 3. The modern way to declare base
class Base(DeclarativeBase):
    pass  # Diese Klasse dient nur als "Anker" für deine Modelle

# 4. Session-Factory
SessionLocal = sessionmaker(bind=engine)