from sqlalchemy.orm import Session
from sqlalchemy import select
import models, schemas # schemas sind die Pydantic-Baupläne (folgen gleich)

def get_author(db: Session, author_id: int):
    return db.execute(
        select(models.Author)
        .where(models.Author.id == author_id)
        ).scalar_one_or_none()

def get_authors(db: Session, skip: int = 0, limit: int = 100):
    """
    Retrieves a list of authors from the database.
    'skip' and 'limit' allow us to paging later (e.g., page 1, 2, 3).
    """
    result = db.execute(select(models.Author).offset(skip).limit(limit))
    return result.scalars().all()

def create_author(db: Session, author: schemas.AuthorCreate):
    db_author = models.Author(first_name=author.first_name, last_name=author.last_name)
    db.add(db_author)
    db.commit()
    db.refresh(db_author)
    return db_author

def update_author(db: Session, author_id: int, first_name: str = None, last_name: str = None):
    db_author = db.query(models.Author).filter(models.Author.id == author_id).first()
    if db_author:
        if first_name: db_author.first_name = first_name
        if last_name: db_author.last_name = last_name
        db.commit()
        db.refresh(db_author)
    return db_author

def delete_author(db: Session, author_id: int):
    db_author = db.query(models.Author).filter(models.Author.id == author_id).first()
    if db_author:
        db.delete(db_author)
        db.commit()
        return True
    return False

def get_quotes(db: Session, skip: int = 0, limit: int = 100):
    # Der moderne 2.0-Weg mit select()
    result = db.execute(select(models.Quote).offset(skip).limit(limit))
    return result.scalars().all()

def get_quotes_by_author(db: Session, author_id: int):
    return db.query(models.Quote).filter(models.Quote.author_id == author_id).all()

def get_quote(db: Session, quote_id: int):
    return db.query(models.Quote).filter(models.Quote.id == quote_id).first()

def create_quote(db: Session, quote: schemas.QuoteCreate, author_id: int):
    db_quote = models.Quote(**quote.model_dump(), author_id=author_id)
    db.add(db_quote)
    db.commit()
    db.refresh(db_quote)
    return db_quote

def update_quote(db: Session, quote_id: int, text: str):
    db_quote = db.query(models.Quote).filter(models.Quote.id == quote_id).first()
    if db_quote:
        db_quote.text = text
        db.commit()
        db.refresh(db_quote)
    return db_quote

def delete_quote(db: Session, quote_id: int):
    db_quote = db.query(models.Quote).filter(models.Quote.id == quote_id).first()
    if db_quote:
        db.delete(db_quote)
        db.commit()
        return True
    return False

def create_author_link(db: Session, link: schemas.AuthorLinkCreate, author_id: int):
    db_link = models.AuthorLink(**link.model_dump(), author_id=author_id)
    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    return db_link

def get_author_links(db: Session, author_id: int):
    result = db.execute(select(models.AuthorLink).where(models.AuthorLink.author_id == author_id))
    return result.scalars().all()

def update_author_link(db: Session, link_id: int, url: str = None, platform: str = None):
    db_link = db.query(models.AuthorLink).filter(models.AuthorLink.id == link_id).first()
    if db_link:
        if url: db_link.url = url
        if platform: db_link.platform = platform
        db.commit()
        db.refresh(db_link)
    return db_link

def delete_author_link(db: Session, link_id: int):
    db_link = db.query(models.AuthorLink).filter(models.AuthorLink.id == link_id).first()
    if db_link:
        db.delete(db_link)
        db.commit()
        return True
    return False