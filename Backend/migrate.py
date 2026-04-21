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

        # 1. Prüfen, ob die Spalte 'is_active' bereits existiert
        cursor.execute("PRAGMA table_info(author_statuses)")
        columns = [col[1] for col in cursor.fetchall()]

        if "is_active" not in columns:
            print("-> Füge Spalte 'is_active' zu 'author_statuses' hinzu...")
            # In SQLite gibt es kein echtes Boolean, wir nutzen INTEGER (0 oder 1)
            cursor.execute("ALTER TABLE author_statuses ADD COLUMN is_active INTEGER DEFAULT 1")

        # 2. Werte explizit setzen nach deiner Vorgabe
        print("-> Aktualisiere Status-Logik...")
        
        # ID 1 & 3: Aktiv
        cursor.execute("UPDATE author_statuses SET is_active = 1 WHERE id IN (1, 3)")
        
        # ID 2 & 4: Inaktiv (Disabled / Payment Due)
        cursor.execute("UPDATE author_statuses SET is_active = 0 WHERE id IN (2, 4)")

        # 3. Falls noch Altlasten in der authors-Tabelle sind
        print("-> Bereinige authors Tabelle...")
        cursor.execute("UPDATE authors SET status_id = 3 WHERE status_id IS NULL")
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