from fastapi import FastAPI, Depends, HTTPException
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

app = FastAPI(
    title="Inspiring Quotes API",
    description="Backend für deine Zitate-App – Fokus: Genuine Non-Neediness"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Any source is permitted for development. Todo: needs to change in production env
    allow_credentials=True,
    allow_methods=["*"], # Allows GET, POST, etc.
    allow_headers=["*"], # Allows all Header
)

# Retrieves a list of authors from the database.
# 'skip' and 'limit' allow us to paging later (e.g., page 1, 2, 3).
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/authors/", response_model=schemas.Author, tags=["Authors"])
def create_author(author: schemas.AuthorCreate, db: Session = Depends(get_db)):
    """Creates a new author in the database."""
    return crud.create_author(db=db, author=author)

@app.get("/authors/", response_model=List[schemas.Author], tags=["Authors"])
def read_authors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Returns a list of all authors including their links."""
    return crud.get_authors(db, skip=skip, limit=limit)

@app.get("/authors/{author_id}", response_model=schemas.Author, tags=["Authors"])
def read_author(author_id: int, db: Session = Depends(get_db)):
    """Search for a specific author using their ID."""
    db_author = crud.get_author(db, author_id=author_id)
    if db_author is None:
        raise HTTPException(status_code=404, detail="Author not found")
    return db_author

@app.post("/authors/{author_id}/links/", response_model=schemas.AuthorLink, tags=["Links"])
def create_link_for_author(author_id: int, link: schemas.AuthorLinkCreate, db: Session = Depends(get_db)):
    """Adds a new link (e.g., Instagram) to an existing author."""
    return crud.create_author_link(db=db, link=link, author_id=author_id)

# Links end points
@app.put("/links/{link_id}", response_model=schemas.AuthorLink, tags=["Links"])
def update_existing_link(link_id: int, url: str = None, platform: str = None, db: Session = Depends(get_db)):
    updated = crud.update_author_link(db, link_id=link_id, url=url, platform=platform)
    if not updated:
        raise HTTPException(status_code=404, detail="Link nicht gefunden")
    return updated

@app.delete("/links/{link_id}", tags=["Links"])
def delete_existing_link(link_id: int, db: Session = Depends(get_db)):
    if not crud.delete_author_link(db, link_id=link_id):
        raise HTTPException(status_code=404, detail="Link nicht gefunden")
    return {"message": "Link wurde gelöscht"}

@app.put("/authors/{author_id}", response_model=schemas.Author, tags=["Authors"])
def update_existing_author(author_id: int, first_name: str = None, last_name: str = None, db: Session = Depends(get_db)):
    updated = crud.update_author(db, author_id=author_id, first_name=first_name, last_name=last_name)
    if not updated:
        raise HTTPException(status_code=404, detail="Author not found")
    return updated

@app.delete("/authors/{author_id}", tags=["Authors"])
def delete_existing_author(author_id: int, db: Session = Depends(get_db)):
    if not crud.delete_author(db, author_id=author_id):
        raise HTTPException(status_code=404, detail="Author not found")
    return {"message": "The author and all associated data have been deleted."}

@app.post("/quotes/", response_model=schemas.Quote, tags=["Quotes"])
def create_quote(quote: schemas.QuoteCreate, author_id: int, db: Session = Depends(get_db)):
    """Saves a new quote and links it to an author ID."""
    return crud.create_quote(db=db, quote=quote, author_id=author_id)

@app.get("/quotes/", response_model=List[schemas.Quote], tags=["Quotes"])
def read_quotes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Returns all quotes (with nested author information)."""
    return crud.get_quotes(db, skip=skip, limit=limit)

@app.get("/quote/{quote_id}", response_model=schemas.Quote, tags=["Quotes"])
def read_quote(quote_id: int, db: Session = Depends(get_db)):
    quote = crud.get_quote(db, quote_id=quote_id)
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    return quote


@app.get("/authors/{author_id}/quotes", response_model=list[schemas.Quote], tags=["Authors"])
def read_author_quotes(author_id: int, db: Session = Depends(get_db)):
    quotes = crud.get_quotes_by_author(db, author_id=author_id)
    if not quotes:
        return []
    return quotes

@app.put("/quotes/{quote_id}", response_model=schemas.Quote, tags=["Quotes"])
def update_existing_quote(quote_id: int, text: str, db: Session = Depends(get_db)):
    updated_quote = crud.update_quote(db, quote_id=quote_id, text=text)
    if not updated_quote:
        raise HTTPException(status_code=404, detail="Zitat nicht gefunden")
    return updated_quote

@app.delete("/quotes/{quote_id}", tags=["Quotes"])
def delete_existing_quote(quote_id: int, db: Session = Depends(get_db)):
    success = crud.delete_quote(db, quote_id=quote_id)
    if not success:
        raise HTTPException(status_code=404, detail="Quote not found")
    return {"message": f"Quote {quote_id} has been deleted successfully"}

# Quote of the Day (Seed based on the date)
@app.get("/quotes/daily", response_model=schemas.Quote, tags=["Quotes"])
def get_daily_quote(db: Session = Depends(get_db)):
    quotes = db.query(models.Quote).all()
    if not quotes:
        raise HTTPException(status_code=404, detail="No quotes found")
    # Nutzt den Tag des Jahres als Zufalls-Seed
    seed = date.today().timetuple().tm_yday
    random.seed(seed)
    return random.choice(quotes)

# Popular Quotes
@app.get("/quotes/popular", response_model=List[schemas.Quote], tags=["Quotes", "popular"])
def get_popular_quotes(limit: int = 6, db: Session = Depends(get_db)):
    return db.query(models.Quote).order_by(models.Quote.likes.desc()).limit(limit).all()

# Recent Quotes (The newest date = highest ID)
@app.get("/quotes/recent", response_model=List[schemas.Quote], tags=["Quotes", "recent"])
def get_recent_quotes(limit: int = 6, db: Session = Depends(get_db)):
    return db.query(models.Quote).order_by(models.Quote.id.desc()).limit(limit).all()

# Like/ unlike ---------------
@app.post("/quotes/{quote_id}/like", tags=["Quotes", "likes"])
def like_quote(quote_id: int, db: Session = Depends(get_db)):
    quote = db.query(models.Quote).filter(models.Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    
    quote.likes += 1
    db.commit()
    return {"likes": quote.likes}

@app.post("/quotes/{quote_id}/unlike", tags=["Quotes", "likes"])
def unlike_quote(quote_id: int, db: Session = Depends(get_db)):
    quote = db.query(models.Quote).filter(models.Quote.id == quote_id).first()
    if quote and quote.likes > 0:
        quote.likes -= 1
        db.commit()
    return {"likes": quote.likes}

@app.get("/authors/{author_id}/quotes", response_model=List[schemas.Quote], tags=["Authors", "Quotes"])
def read_author_quotes(author_id: int, db: Session = Depends(get_db)):
    # Simpler Query: Hole alle Quotes, bei denen author_id passt
    quotes = crud.get_quotes_by_author(db, author_id=author_id)
    return quotes