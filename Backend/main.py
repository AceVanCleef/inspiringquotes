import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from sqlalchemy.orm import Session
from sqlalchemy import func, select
from typing import Dict, List
from enums.user_roles import UserRoles
import models, schemas, crud
from access_security import require_admin_key, require_any_key
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
import random
from datetime import date

# This command creates the tables in the SQLite file,
# if they do not already exist.
models.Base.metadata.create_all(bind=engine)

load_dotenv()
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="Inspiring Quotes API",
    description="A curated collection of inspiring quotes - collected by a Swiss Expert in personal developtment.",
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS configuration
raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
env_origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=env_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=[
        "Content-Type", # JSON
        "Authorization", # Tokens
        "Accept" # regular traffic
    ],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/authors/", response_model=schemas.Author, tags=["Authors"])
@limiter.limit("15/minute")
def create_author(
    request: Request, 
    author: schemas.AuthorCreate, 
    db: Session = Depends(get_db),
    api_key_role: str = Depends(require_admin_key)
):
    """Creates a new author in the database."""
    return crud.create_author(db=db, author=author)

@app.get("/authors/", tags=["Authors"])
@limiter.limit("60/minute")
def read_authors(
    request: Request, 
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    api_key_role: str = Depends(require_any_key)
):
    """Returns a list of all authors including their links."""
    is_admin = (api_key_role == UserRoles.ADMIN)
    authors = crud.get_authors(db, skip=skip, limit=limit, only_active=not is_admin)

    if is_admin:
        return [schemas.AuthorAdminPanelDTO.model_validate(a) for a in authors]
    
    return [schemas.Author.model_validate(a) for a in authors]

@app.get("/authors/{author_id}", response_model=schemas.Author, tags=["Authors"])
@limiter.limit("60/minute")
def read_author(
    request: Request,
    author_id: int, 
    db: Session = Depends(get_db),
    api_key_role: str = Depends(require_any_key)
):
    """Search for a specific author using their ID."""   
    db_author = crud.get_author(db, author_id=author_id)

    if db_author is None:
        raise HTTPException(status_code=404, detail="Author not found")
    
    if  api_key_role != UserRoles.ADMIN and db_author.status and not db_author.status.is_active:
        raise HTTPException(status_code=404, detail="Author has been disabled")
    return db_author

# Links end points
@app.get("/linktypes", response_model=List[schemas.LinkType], tags=["Link types"])
@limiter.limit("60/min")
def read_link_types(
    request: Request,
    db: Session = Depends(get_db),
    api_key_role: str = Depends(require_any_key)
):
    return crud.get_link_types(db)

@app.put("/authors/{author_id}", response_model=schemas.Author, tags=["Authors"])
@limiter.limit("15/minute")
def update_existing_author(
    request: Request,
    author_id: int,
    author_data: schemas.AuthorUpdate,
    db: Session = Depends(get_db),
    api_key_role: str = Depends(require_admin_key)
):
    updated = crud.update_author(db, author_id=author_id, author_update=author_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Author not found")
    return updated

@app.delete("/authors/{author_id}", tags=["Authors"])
@limiter.limit("15/minute")
def delete_existing_author(
    request: Request,
    author_id: int,
    db: Session = Depends(get_db),
    api_key_role: str = Depends(require_admin_key)
):
    if not crud.delete_author(db, author_id=author_id):
        raise HTTPException(status_code=404, detail="Author not found")
    return {"message": "The author and all associated data have been deleted."}

@app.post("/quotes/", response_model=schemas.Quote, tags=["Quotes"])
@limiter.limit("15/minute")
def create_quote(
    request: Request,
    quote: schemas.QuoteCreate,
    db: Session = Depends(get_db),
    api_key_role: str = Depends(require_admin_key)
):
    """Saves a new quote and links it to an author ID."""
    db_quote = crud.create_quote(db=db, quote=quote)
    if not db_quote:
        raise HTTPException(status_code=404, detail="Author not found. Quote can't be created.")
    return db_quote

@app.get("/quotes/", response_model=List[schemas.Quote], tags=["Quotes"])
@limiter.limit("60/minute")
def read_quotes(
    request: Request,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    api_key_role: str = Depends(require_any_key)
):
    """Returns all quotes (with nested author information)."""
    return crud.get_quotes(db, skip=skip, limit=limit, only_active=api_key_role != UserRoles.ADMIN)

@app.get("/quote/{quote_id}", response_model=schemas.Quote, tags=["Quotes"])
@limiter.limit("60/minute")
def read_quote(
    request: Request,
    quote_id: int,
    db: Session = Depends(get_db),
    api_key_role: str = Depends(require_any_key)
):
    quote = crud.get_quote(db, quote_id=quote_id)
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    
    if  api_key_role != UserRoles.ADMIN and quote.author.status and not quote.author.status.is_active:
        raise HTTPException(status_code=404, detail="Author of this quote has been disabled. Thus, this quote is not shown.")
    return quote

@app.put("/quotes/{quote_id}", response_model=schemas.Quote, tags=["Quotes"])
@limiter.limit("15/minute")
def update_existing_quote(
    request: Request,
    quote_id: int,
    quote: schemas.QuoteUpdate,
    db: Session = Depends(get_db),
    api_key_role: str = Depends(require_admin_key)
):
    updated_quote = crud.update_quote(db, quote_id=quote_id, quote=quote)
    if not updated_quote:
        raise HTTPException(status_code=404, detail="Zitat nicht gefunden")
    return updated_quote

@app.delete("/quotes/{quote_id}", tags=["Quotes"])
@limiter.limit("15/minute")
def delete_existing_quote(
    request: Request,
    quote_id: int,
    db: Session = Depends(get_db),
    api_key_role: str = Depends(require_admin_key)
):
    success = crud.delete_quote(db, quote_id=quote_id)
    if not success:
        raise HTTPException(status_code=404, detail="Quote not found")
    return {"message": f"Quote {quote_id} has been deleted successfully"}


@app.get("/authors/{author_id}/quotes", response_model=list[schemas.Quote], tags=["Quotes"])
@limiter.limit("60/minute")
def read_author_quotes(
    request: Request,
    author_id: int,
    db: Session = Depends(get_db),
    api_key_role: str = Depends(require_any_key)
):
    db_author = crud.get_author(db, author_id=author_id)
    
    if db_author is None:
        raise HTTPException(status_code=404, detail="Author not found")
    
    if api_key_role != UserRoles.ADMIN and db_author.status and not db_author.status.is_active:
        raise HTTPException(status_code=404, detail="Author of these quotes has been disabled")
    
    quotes = crud.get_quotes_by_author(db, author_id=author_id)
    if not quotes:
        return []
    
    return quotes

@app.delete("/authors/{author_id}/quotes", tags=["Quotes"])
def delete_all_author_quotes(
    request: Request,
    author_id: int,
    db: Session = Depends(get_db),
    api_key_role: str = Depends(require_admin_key)
):
    author = crud.get_author(db, author_id=author_id)
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    
    deleted_count = crud.delete_quotes_by_author(db, author_id=author_id)
    return {"message": f"Successfully deleted {deleted_count} quotes."}

# Quote of the Day (Seed based on the date)
@app.get("/quotes/daily", response_model=schemas.Quote, tags=["Quotes"])
@limiter.limit("60/minute")
def get_daily_quote(
    request: Request,
    db: Session = Depends(get_db),
    api_key_role: str = Depends(require_any_key)
):
    active_quote = crud.get_daily_quote(db)

    if not active_quote:
        raise HTTPException(status_code=404, detail="No quote found")

    return active_quote

# Popular Quotes
@app.get("/quotes/popular", response_model=List[schemas.Quote], tags=["Quotes", "popular"])
@limiter.limit("60/minute")
def get_popular_quotes(
    request: Request,
    limit: int = 6,
    db: Session = Depends(get_db),
    api_key_role: str = Depends(require_any_key)
):
    stmt = (
        select(models.Quote)
        .join(models.Quote.author)
        .join(models.Author.status)
        .where(models.AuthorStatus.is_active == True)
        .order_by(models.Quote.likes.desc())
        .limit(limit)
    )
    
    result = db.execute(stmt)
    return result.scalars().all()

# Recent Quotes (The newest date = highest ID)
@app.get("/quotes/recent", response_model=List[schemas.Quote], tags=["Quotes", "recent"])
@limiter.limit("60/minute")
def get_recent_quotes(
    request: Request,
    limit: int = 6,
    db: Session = Depends(get_db),
    api_key_role: str = Depends(require_any_key)
):
    stmt = (
        select(models.Quote)
        .join(models.Quote.author)
        .join(models.Author.status)
        .where(models.AuthorStatus.is_active == True)
        .order_by(models.Quote.id.desc())
        .limit(limit)
    )
    
    result = db.execute(stmt)
    return result.scalars().all()
    
# Like/ unlike ---------------
@app.post("/quotes/{quote_id}/like", tags=["Quotes", "likes"])
@limiter.limit("15/minute")
def like_quote(
    request: Request,
    quote_id: int, db: Session = Depends(get_db),
    api_key_role: str = Depends(require_any_key)
):
    quote = db.query(models.Quote).filter(models.Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    
    quote.likes += 1
    db.commit()
    return {"likes": quote.likes}

@app.post("/quotes/{quote_id}/unlike", tags=["Quotes", "likes"])
@limiter.limit("15/minute")
def unlike_quote(
    request: Request,
    quote_id: int,
    db: Session = Depends(get_db),
    api_key_role: str = Depends(require_any_key)
):
    quote = db.query(models.Quote).filter(models.Quote.id == quote_id).first()
    if quote and quote.likes > 0:
        quote.likes -= 1
        db.commit()
    return {"likes": quote.likes}


# author status
@app.get("/authorstatuses", response_model=List[schemas.AuthorStatusDTO], tags=["author status"])
@limiter.limit("60/min")
def get_author_statuses(
    request: Request,
    db: Session = Depends(get_db),
    api_key_role: str = Depends(require_admin_key)
):
    return crud.get_author_statuses(db)

@app.get("/dashboard/stats", response_model=Dict[str, int], tags=["Dashboard"])
@limiter.limit("60/min")
def get_dashboard_stats(
    request: Request,
    db: Session = Depends(get_db),
    api_key_role: str = Depends(require_admin_key)
):
    return crud.get_author_status_counts(db)