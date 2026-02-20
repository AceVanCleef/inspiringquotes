from pydantic import BaseModel, HttpUrl
from typing import List, Optional

# --- Link Type DTO ---
class LinkTypeBase(BaseModel):
    name: str

class LinkType(LinkTypeBase):
    id: int
    class Config:
        from_attributes = True
        
# --- LINK DTOs ---
DEFAULT_LINK_TYPE = {"id": 1, "name": "Website"}
class AuthorLinkBase(BaseModel):
    url: str # Später kannst du HttpUrl nutzen für striktere Checks
    label: Optional[str] = None

class AuthorLinkCreate(AuthorLinkBase):
    author_id: int
    link_type_id: int
    
class AuthorLinkUpdate(BaseModel):
    url: Optional[str] = None
    label: Optional[str] = None
    link_type_id: Optional[int] = None
    author_id: Optional[int] = None
    
    class Config:
        from_attributes = True

class AuthorLink(AuthorLinkBase):
    id: int
    author_id: int
    link_type: Optional[LinkType] = DEFAULT_LINK_TYPE

    class Config:
        from_attributes = True

# --- AUTHOR DTOs ---
class AuthorBase(BaseModel):
    first_name: str
    last_name: str
    bio: Optional[str] = None
    profile_image_path: Optional[str] = None

class AuthorCreate(AuthorBase):
    pass

class AuthorUpdate(BaseModel):
    # Alle Felder sind hier Optional, damit man auch nur Teil-Updates machen kann
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    profile_image_path: Optional[str] = None

    class Config:
        from_attributes = True

class Author(AuthorBase):
    id: int
    links: Optional[List[AuthorLink]] = []

    class Config:
        from_attributes = True

# --- QUOTE DTOs ---
class QuoteBase(BaseModel):
    text: str
    likes: int = 0

class QuoteCreate(QuoteBase):
    pass

class Quote(QuoteBase):
    id: int
    author_id: int
    author: Author # Hier passiert die Verschachtelung, die du wolltest!

    class Config:
        from_attributes = True