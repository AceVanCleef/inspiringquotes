from contextlib import asynccontextmanager
from fastapi import FastAPI
from sqlalchemy import text
from database_config import SessionLocal, engine
import models

@asynccontextmanager
async def lifespan_handler(app: FastAPI):
    # Setup: Tables and Seeds
    models.Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        if db.query(models.AuthorStatus).count() == 0:
            print("INFO: Seeding author_statuses...")
            statuses = [
                models.AuthorStatus(id=1, name="active", is_active=True),
                models.AuthorStatus(id=2, name="payment_due", is_active=True),
                models.AuthorStatus(id=3, name="payment_overdue", is_active=False),
                models.AuthorStatus(id=4, name="public_domain", is_active=True),
                models.AuthorStatus(id=5, name="disabled", is_active=False)
            ]
            db.add_all(statuses)
            db.commit()
            
            # Ensures automatic ID incrementation
            db.execute(text("SELECT setval('author_statuses_id_seq', (SELECT MAX(id) FROM author_statuses))"))
            db.commit()
        
        if db.query(models.LinkType).count() == 0:
            print("INFO: Seeding link_types...")
            link_types = [
                models.LinkType(id=1, name="Website"),
                models.LinkType(id=2, name="TikTok"),
                models.LinkType(id=3, name="LinkedIn"),
                models.LinkType(id=4, name="YouTube"),
                models.LinkType(id=5, name="X"),
                models.LinkType(id=6, name="Instagram"),
                models.LinkType(id=7, name="Facebook")
            ]
            db.add_all(link_types)
            db.commit()
            
            # Ensures automatic ID incrementation
            db.execute(text("SELECT setval('link_types_id_seq', (SELECT MAX(id) FROM link_types))"))
            db.commit()
            
    yield  # Die App läuft jetzt
    
    # Optional: Cleanup beim Beenden