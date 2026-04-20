from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy import or_, select
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

def get_authors(db: Session, skip: int = 0, limit: int = 100, only_active: bool = False):
    """
    Retrieves a list of authors from the database.
    'skip' and 'limit' allow us to paging later (e.g., page 1, 2, 3).
    """
    # 1. Statement erstellen (nur ein select!)
    stmt = select(models.Author).options(joinedload(models.Author.quotes))
    
    # 2. Filter anwenden, falls nur aktive Autoren gewünscht sind
    if only_active:
        # We are sending only ACTIVE and PUBLIC_DOMAIN authors
        stmt = stmt.where(models.Author.status_id.in_([1, 3]))
    
    # 3. Paging anwenden und ausführen
    # .unique() ist wichtig bei joinedload, um Duplikate im Result-Set zu vermeiden
    result = db.execute(stmt.offset(skip).limit(limit)).unique()
    
    return result.scalars().all()

def create_author(db: Session, author: schemas.AuthorCreate):
    links_data = author.links if hasattr(author, 'links') else []
    db_author = models.Author(**author.model_dump(exclude={'links'}, mode="json"))
    db.add(db_author)
    db.flush()
    
    for link_data in links_data:
        db_link = models.AuthorLink(
            **link_data.model_dump(mode="json", exclude={"id", "author_id"}),
            author_id=db_author.id
        )
        db.add(db_link)
        
    db.commit()
    db.refresh(db_author)
    return db_author

def update_author(db: Session, author_id: int, author_update: schemas.AuthorUpdate):
    db_author = db.query(models.Author).filter(models.Author.id == author_id).first()
    if db_author:
        # Hier sorgt 'exclude_unset=True' dafür, dass nur die Felder im JSON
        # die Datenbank ändern. Fehlende Felder im JSON bleiben in der DB unberührt.
        update_data = author_update.model_dump(exclude_unset=True, exclude={"links"}, mode="json") 
        
        for key, value in update_data.items():
            setattr(db_author, key, value)
        
        # reconsile links
        if author_update.links is not None:
            existing_links = {link.id: link for link in db_author.links}
            incoming_links = author_update.links
            
            # delete links that are no longer needed
            incoming_ids = {l.id for l in incoming_links if l.id is not None}
            for link_id in list(existing_links.keys()):
                if link_id not in incoming_ids:
                    db.delete(existing_links[link_id])
            
            # create and update links
            for link_data in incoming_links:
                if link_data.id and link_data.id in existing_links:
                    # Update
                    target_link = existing_links[link_data.id]
                    for key, value in link_data.model_dump(exclude_unset=True, mode="json").items():
                        setattr(target_link, key, value)
                else:
                    # Create
                    new_link = models.AuthorLink(
                        **link_data.model_dump(exclude={"id", "author_id"}, mode="json"), 
                        author_id=db_author.id
                    )
                    db.add(new_link)
        
        try:
            db.commit()
            db.refresh(db_author)
        except Exception as e:
            db.rollback()
            print(f"Database error: {e}")
            raise e
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

def create_quote(db: Session, quote: schemas.QuoteCreate):
    author_exists = db.query(models.Author).filter(models.Author.id == quote.author_id).first()
    if not author_exists:
        return None
    
    db_quote = models.Quote(**quote.model_dump())
    db.add(db_quote)
    db.commit()
    db.refresh(db_quote)
    return db_quote

def update_quote(db: Session, quote_id: int, quote: schemas.QuoteUpdate):
    db_quote = db.query(models.Quote).filter(models.Quote.id == quote_id).first()
    
    if not db_quote:
        return None
    
    update_data = quote.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        # Da dein QuoteUpdate 'author_id' enthält und dein Model auch 'author_id' hat,
        # mappt das hier direkt. SQLAlchemy kümmert sich um die Beziehung.
        setattr(db_quote, key, value)
    
    db.commit()
    db.refresh(db_quote) # Lädt auch das verschachtelte Author-Objekt für das response_model nach
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

def get_author_links(db: Session, author_id: int):
    result = db.execute(
        select(models.AuthorLink)
        .options(joinedload(models.AuthorLink.link_type))
        .where(models.AuthorLink.author_id == author_id))
    return result.unique().scalars().all()

def get_link_types(db: Session):
    result = db.execute(select(models.LinkType))
    return result.scalars().all()