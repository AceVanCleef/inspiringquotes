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
        print("--- Starte Migration auf Lookup-Tabelle ---")

        # 1. Erstelle die neue Status-Tabelle
        print("-> Erstelle 'author_statuses'...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS author_statuses (
                id INTEGER PRIMARY KEY,
                name VARCHAR(50) UNIQUE NOT NULL
            )
        """)

        # 2. Initialisiere die Status-Werte (Fixe IDs für Peace of Mind)
        statuses = [
            (1, 'active'),
            (2, 'payment_due'),
            (3, 'public_domain'),
            (4, 'disabled')
        ]
        cursor.executemany("INSERT OR IGNORE INTO author_statuses (id, name) VALUES (?, ?)", statuses)

        # 3. Prüfe, ob 'status_id' in 'authors' bereits existiert
        cursor.execute("PRAGMA table_info(authors)")
        columns = [col[1] for col in cursor.fetchall()]

        if "status_id" not in columns:
            print("-> Füge 'status_id' zu 'authors' hinzu...")
            cursor.execute("ALTER TABLE authors ADD COLUMN status_id INTEGER REFERENCES author_statuses(id)")

        # 4. Daten-Migration: Mapping von altem String-Status auf neue ID
        print("-> Migriere bestehende Status-Daten auf IDs...")
        mapping = {
            'active': 1,
            'payment_due': 2,
            'public_domain': 3,
            'public': 3,      # Sicherheitsnetz für den alten Wert
            'disabled': 4
        }

        for status_name, status_id in mapping.items():
            cursor.execute(
                "UPDATE authors SET status_id = ? WHERE status = ?", 
                (status_id, status_name)
            )

        # 5. Fallback: Alle, die jetzt noch keine ID haben, werden 'public_domain'
        cursor.execute("UPDATE authors SET status_id = 3 WHERE status_id IS NULL")

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