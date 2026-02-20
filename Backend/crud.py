from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy import select
import models, schemas # schemas sind die Pydantic-Baupläne (folgen gleich)

def get_author(db: Session, author_id: int):
    return db.execute(
        select(models.Author)
        .options(
            selectinload(models.Author.links)
            .joinedload(models.AuthorLink.link_type)
        )
        .where(models.Author.id == author_id)
    ).unique().scalar_one_or_none()

def get_authors(db: Session, skip: int = 0, limit: int = 100):
    """
    Retrieves a list of authors from the database.
    'skip' and 'limit' allow us to paging later (e.g., page 1, 2, 3).
    """
    result = db.execute(select(models.Author).offset(skip).limit(limit))
    return result.scalars().all()

def create_author(db: Session, author: schemas.AuthorCreate):
    db_author = models.Author(**author.model_dump())
    db.add(db_author)
    db.commit()
    db.refresh(db_author)
    return db_author

def update_author(db: Session, author_id: int, author_update: schemas.AuthorUpdate):
    db_author = db.query(models.Author).filter(models.Author.id == author_id).first()
    if db_author:
        # Hier sorgt 'exclude_unset=True' dafür, dass nur die Felder im JSON
        # die Datenbank ändern. Fehlende Felder im JSON bleiben in der DB unberührt.
        update_data = author_update.model_dump(exclude_unset=True) 
        
        for key, value in update_data.items():
            setattr(db_author, key, value)
            
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
    result = db.execute(select(models.Quote)
                        .options(joinedload(models.Quote.author)) 
                        .offset(skip).limit(limit))
    return result.unique().scalars().all()

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

def delete_quotes_by_author(db: Session, author_id: int):
    result = db.query(models.Quote).filter(models.Quote.author_id == author_id).delete()
    db.commit()
    return result

def create_author_link(db: Session, link: schemas.AuthorLinkCreate, author_id: int):
    # 1. Daten aus dem Schema holen und die author_id aus der URL sicherstellen
    link_data = link.model_dump()
    link_data["author_id"] = author_id
    
    # 2. Modell-Instanz erstellen
    db_link = models.AuthorLink(**link_data)
    
    # 3. In die Datenbank schreiben
    db.add(db_link)
    db.commit()
    # Wir brauchen kein einfaches refresh(), da wir unten eine frische Query mit Join machen
    
    # 4. Den Link mit seinem verknüpften Typ neu laden
    # Das stellt sicher, dass 'link_type' für das Pydantic-Schema verfügbar ist
    return (
        db.query(models.AuthorLink)
        .options(joinedload(models.AuthorLink.link_type))
        .filter(models.AuthorLink.id == db_link.id)
        .first()
    )
    
def get_author_links(db: Session, author_id: int):
    result = db.execute(
        select(models.AuthorLink)
        .options(joinedload(models.AuthorLink.link_type))
        .where(models.AuthorLink.author_id == author_id))
    return result.unique().scalars().all()

def update_author_link(db: Session, link_id: int, link_data: schemas.AuthorLinkUpdate):
    db_link = db.query(models.AuthorLink).options(
        joinedload(models.AuthorLink.link_type)
    ).filter(models.AuthorLink.id == link_id).first()
    
    if db_link:
        update_data = link_data.model_dump(exclude_unset=True)
        
        for key, value in update_data.items():
            setattr(db_link, key, value)
            
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