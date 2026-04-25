from contextlib import asynccontextmanager

from fastapi import FastAPI

from Backend.crud import get_authors_expiring_in_30_days, get_expired_authors, set_authors_to_payment_due, set_authors_to_payment_overdue
from apscheduler.schedulers.background import BackgroundScheduler

from Backend.database import SessionLocal

def check_upcoming_payments():
    db = SessionLocal() # Neue Session öffnen
    try:
        authors = get_authors_expiring_in_30_days(db)
        author_ids: list[int] = []
        for author in authors:
            # Hier die Logik: E-Mail senden, Notification erstellen, etc.
            author_ids.append(author.id)
            print(f"Sende Zahlungserinnerung an: {author.name}")
        
        if len(author_ids) > 0:
            set_authors_to_payment_due(author_ids)
    finally:
        db.close()
        
def check_overdue_payments():
    db = SessionLocal() # Neue Session öffnen
    try:
        authors = get_expired_authors(db)
        author_ids: list[int] = []
        for author in authors:
            # Hier die Logik: E-Mail senden, Notification erstellen, etc.
            author_ids.append(author.id)
            print(f"Sende Zahlungserinnerung an: {author.name}")
        
        if len(author_ids) > 0:
            set_authors_to_payment_overdue(author_ids)
    finally:
        db.close()

scheduler = BackgroundScheduler()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Jobs hinzufügen: Läuft jeden Tag um 00:01 und 00:02
    scheduler.add_job(check_upcoming_payments, 'cron', hour=0, minute=1)
    scheduler.add_job(check_overdue_payments, 'cron', hour=0, minute=2)
    scheduler.start()
    print("Scheduler gestartet...")
    
    yield  # Hier läuft die App
    
    # Alles hier drin läuft beim STOPP des Servers
    scheduler.shutdown()
    print("Scheduler gestoppt...")

app = FastAPI(lifespan=lifespan)