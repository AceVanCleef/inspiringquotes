import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import models, schemas, crud
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
    description="A curated collection of inspiring quotes - collected by a Swiss Expert in personal developtment."
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
def create_author(request: Request, author: schemas.AuthorCreate, db: Session = Depends(get_db)):
    """Creates a new author in the database."""
    return crud.create_author(db=db, author=author)

@app.get("/authors/", response_model=List[schemas.Author], tags=["Authors"])
@limiter.limit("60/minute")
def read_authors(request: Request, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Returns a list of all authors including their links."""
    return crud.get_authors(db, skip=skip, limit=limit)

@app.get("/authors/{author_id}", response_model=schemas.Author, tags=["Authors"])
@limiter.limit("60/minute")
def read_author(request: Request, author_id: int, db: Session = Depends(get_db)):
    """Search for a specific author using their ID."""
    db_author = crud.get_author(db, author_id=author_id)
    if db_author is None:
        raise HTTPException(status_code=404, detail="Author not found")
    return db_author

# Links end points

# @app.post("/authors/{author_id}/links/", response_model=schemas.AuthorLink, tags=["Links"])
# @limiter.limit("15/minute")
# def create_link_for_author(request: Request, author_id: int, link: schemas.AuthorLinkCreate, db: Session = Depends(get_db)):
#     """Adds a new link (e.g., Instagram) to an existing author."""
#     return crud.create_author_link(db=db, link=link, author_id=author_id)

# @app.put("/links/{link_id}", response_model=schemas.AuthorLink, tags=["Links"])
# @limiter.limit("15/minute")
# def update_existing_link(request: Request, link_id: int, link_data: schemas.AuthorLinkUpdate, db: Session = Depends(get_db)):
#     updated = crud.update_author_link(db, link_id=link_id, link_data=link_data)
#     if not updated:
#         raise HTTPException(status_code=404, detail="Link nicht gefunden")
#     return updated

# @app.delete("/links/{link_id}", tags=["Links"])
# @limiter.limit("15/minute")
# def delete_existing_link(request: Request, link_id: int, db: Session = Depends(get_db)):
#     if not crud.delete_author_link(db, link_id=link_id):
#         raise HTTPException(status_code=404, detail="Link nicht gefunden")
#     return {"message": "Link wurde gelöscht"}

@app.get("/linktypes", response_model=List[schemas.LinkType], tags=["Link types"])
@limiter.limit("60/min")
def read_link_types(request: Request, db: Session = Depends(get_db)):
    return crud.get_link_types(db)

@app.put("/authors/{author_id}", response_model=schemas.Author, tags=["Authors"])
@limiter.limit("15/minute")
def update_existing_author(request: Request, author_id: int, author_data: schemas.AuthorUpdate, db: Session = Depends(get_db)):
    print("\n" + "="*30)
    print("update existing author", author_id, author_data)
    print("="*30 + "\n")
    updated = crud.update_author(db, author_id=author_id, author_update=author_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Author not found")
    return updated

@app.delete("/authors/{author_id}", tags=["Authors"])
@limiter.limit("15/minute")
def delete_existing_author(request: Request, author_id: int, db: Session = Depends(get_db)):
    if not crud.delete_author(db, author_id=author_id):
        raise HTTPException(status_code=404, detail="Author not found")
    return {"message": "The author and all associated data have been deleted."}

@app.post("/quotes/", response_model=schemas.Quote, tags=["Quotes"])
@limiter.limit("15/minute")
def create_quote(request: Request, quote: schemas.QuoteCreate, author_id: int, db: Session = Depends(get_db)):
    """Saves a new quote and links it to an author ID."""
    return crud.create_quote(db=db, quote=quote, author_id=author_id)

@app.get("/quotes/", response_model=List[schemas.Quote], tags=["Quotes"])
@limiter.limit("60/minute")
def read_quotes(request: Request, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Returns all quotes (with nested author information)."""
    return crud.get_quotes(db, skip=skip, limit=limit)

@app.get("/quote/{quote_id}", response_model=schemas.Quote, tags=["Quotes"])
@limiter.limit("60/minute")
def read_quote(request: Request, quote_id: int, db: Session = Depends(get_db)):
    quote = crud.get_quote(db, quote_id=quote_id)
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    return quote

@app.put("/quotes/{quote_id}", response_model=schemas.Quote, tags=["Quotes"])
@limiter.limit("15/minute")
def update_existing_quote(request: Request, quote_id: int, text: str, db: Session = Depends(get_db)):
    updated_quote = crud.update_quote(db, quote_id=quote_id, text=text)
    if not updated_quote:
        raise HTTPException(status_code=404, detail="Zitat nicht gefunden")
    return updated_quote

@app.delete("/quotes/{quote_id}", tags=["Quotes"])
@limiter.limit("15/minute")
def delete_existing_quote(request: Request, quote_id: int, db: Session = Depends(get_db)):
    success = crud.delete_quote(db, quote_id=quote_id)
    if not success:
        raise HTTPException(status_code=404, detail="Quote not found")
    return {"message": f"Quote {quote_id} has been deleted successfully"}


@app.get("/authors/{author_id}/quotes", response_model=list[schemas.Quote], tags=["Quotes"])
@limiter.limit("60/minute")
def read_author_quotes(request: Request, author_id: int, db: Session = Depends(get_db)):
    quotes = crud.get_quotes_by_author(db, author_id=author_id)
    if not quotes:
        return []
    return quotes

@app.delete("/authors/{author_id}/quotes", tags=["Quotes"])
def delete_all_author_quotes(request: Request, author_id: int, db: Session = Depends(get_db)):
    author = crud.get_author(db, author_id=author_id)
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    
    deleted_count = crud.delete_quotes_by_author(db, author_id=author_id)
    return {"message": f"Successfully deleted {deleted_count} quotes."}

# Quote of the Day (Seed based on the date)
@app.get("/quotes/daily", response_model=schemas.Quote, tags=["Quotes"])
@limiter.limit("60/minute")
def get_daily_quote(request: Request, db: Session = Depends(get_db)):
    quotes = db.query(models.Quote).all()
    if not quotes:
        raise HTTPException(status_code=404, detail="No quotes found")
    # Nutzt den Tag des Jahres als Zufalls-Seed
    seed = date.today().timetuple().tm_yday
    random.seed(seed)
    return random.choice(quotes)

# Popular Quotes
@app.get("/quotes/popular", response_model=List[schemas.Quote], tags=["Quotes", "popular"])
@limiter.limit("60/minute")
def get_popular_quotes(request: Request, limit: int = 6, db: Session = Depends(get_db)):
    return db.query(models.Quote).order_by(models.Quote.likes.desc()).limit(limit).all()

# Recent Quotes (The newest date = highest ID)
@app.get("/quotes/recent", response_model=List[schemas.Quote], tags=["Quotes", "recent"])
@limiter.limit("60/minute")
def get_recent_quotes(request: Request, limit: int = 6, db: Session = Depends(get_db)):
    return db.query(models.Quote).order_by(models.Quote.id.desc()).limit(limit).all()

# Like/ unlike ---------------
@app.post("/quotes/{quote_id}/like", tags=["Quotes", "likes"])
@limiter.limit("15/minute")
def like_quote(request: Request, quote_id: int, db: Session = Depends(get_db)):
    quote = db.query(models.Quote).filter(models.Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    
    quote.likes += 1
    db.commit()
    return {"likes": quote.likes}

@app.post("/quotes/{quote_id}/unlike", tags=["Quotes", "likes"])
@limiter.limit("15/minute")
def unlike_quote(request: Request, quote_id: int, db: Session = Depends(get_db)):
    quote = db.query(models.Quote).filter(models.Quote.id == quote_id).first()
    if quote and quote.likes > 0:
        quote.likes -= 1
        db.commit()
    return {"likes": quote.likes}
