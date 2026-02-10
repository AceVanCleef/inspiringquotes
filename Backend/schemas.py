from pydantic import BaseModel, HttpUrl
from typing import List, Optional

# --- LINK DTOs ---
class AuthorLinkBase(BaseModel):
    url: str # Später kannst du HttpUrl nutzen für striktere Checks
    platform: Optional[str] = None

class AuthorLinkCreate(AuthorLinkBase):
    pass # Daten, die wir beim Erstellen senden

class AuthorLink(AuthorLinkBase):
    id: int
    author_id: int

    class Config:
        from_attributes = True # Das ist wichtig! Erlaubt Pydantic, SQLAlchemy-Objekte zu lesen

# --- AUTHOR DTOs ---
class AuthorBase(BaseModel):
    first_name: str
    last_name: str

class AuthorCreate(AuthorBase):
    pass

class Author(AuthorBase):
    id: int
    links: List[AuthorLink] = []

    class Config:
        from_attributes = True

# --- QUOTE DTOs ---
class QuoteBase(BaseModel):
    text: str

class QuoteCreate(QuoteBase):
    pass

class Quote(QuoteBase):
    id: int
    author_id: int
    author: Author # Hier passiert die Verschachtelung, die du wolltest!

    class Config:
        from_attributes = True