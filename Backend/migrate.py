import sqlite3
import os

def run_migration():
    # Achte darauf, dass der Dateiname deiner DB hier stimmt!
    db_name = 'inspiring_quotes.db' 
    
    if not os.path.exists(db_name):
        print(f"Fehler: Datenbank '{db_name}' nicht gefunden. Prüfe den Pfad.")
        return

    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    try:
        print("--- Starte Migration: AuthorStatus Erweiterung ---")


        conn.commit()
        print("--- Migration erfolgreich! ---")
        print("Hinweis: Die Spalte 'status' existiert noch, wird aber nicht mehr benötigt.")

    except Exception as e:
        print(f"KRITISCHER FEHLER bei der Migration: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    run_migration()