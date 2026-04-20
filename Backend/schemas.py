from datetime import date
from pydantic import BaseModel, HttpUrl
from typing import List, Optional

### API DTO Definitions ###

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
    url: HttpUrl
    label: Optional[str] = None

class AuthorLinkCreate(AuthorLinkBase):
    author_id: int
    link_type_id: int
    
class AuthorLinkUpdate(BaseModel):
    id: Optional[int] = None
    url: Optional[HttpUrl] = None
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
    profile_image_path: Optional[HttpUrl] = None

class AuthorCreate(AuthorBase):
    links: Optional[List[AuthorLinkUpdate]] = []
    status_id: Optional[int] = 3 # public_domain
    subscription_expiry: Optional[date] = None
    internal_note: Optional[str] = None

class AuthorUpdate(BaseModel):
    # Alle Felder sind hier Optional, damit man auch nur Teil-Updates machen kann
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    profile_image_path: Optional[HttpUrl] = None
    links: Optional[List[AuthorLinkUpdate]] = None

    class Config:
        from_attributes = True
        
    status_id: Optional[int] = None
    subscription_expiry: Optional[date] = None
    internal_note: Optional[str] = None


class Author(AuthorBase):
    id: int
    links: Optional[List[AuthorLink]] = []
    quote_count: int = 0

    class Config:
        from_attributes = True

class AuthorAdminPanelDTO(Author):
    status_id: int
    subscription_expiry: Optional[date] = None
    internal_note: Optional[str] = None
    
    class Config:
        from_attributes = True

# --- QUOTE DTOs ---
class QuoteBase(BaseModel):
    text: str
    likes: int = 0

class QuoteCreate(QuoteBase):
   # text: str
    author_id: int

class Quote(QuoteBase):
    id: int
    author: Author

    class Config:
        from_attributes = True
        
class QuoteUpdate(BaseModel):
    text: Optional[str] = None
    author_id: Optional[int] = None
