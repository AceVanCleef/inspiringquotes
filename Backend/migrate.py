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
        print("--- Starte Migration ---")

        # 1. Tabelle 'authors' aktualisieren
        cursor.execute("PRAGMA table_info(authors)")
        author_columns = [col[1] for col in cursor.fetchall()]
        
        if "profile_image_path" not in author_columns:
            print("-> Füge 'profile_image_path' zu 'authors' hinzu...")
            cursor.execute("ALTER TABLE authors ADD COLUMN profile_image_path VARCHAR(255)")
        
        # 2. TABELLE 'link_types' (Falls sie noch fehlt)
        print("-> Prüfe 'link_types' Tabelle...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS link_types (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(50) UNIQUE NOT NULL
            )
        """)

        # 3. TABELLE 'author_links' (Falls sie noch fehlt oder neu strukturiert werden muss)
        print("-> Prüfe 'author_links' Tabelle...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS author_links (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url VARCHAR(255) NOT NULL,
                label VARCHAR(50),
                link_type_id INTEGER,
                author_id INTEGER,
                FOREIGN KEY (link_type_id) REFERENCES link_types(id),
                FOREIGN KEY (author_id) REFERENCES authors(id)
            )
        """)

        # 4. DATEN-CLEANUP: Der 'string'-Bugfix
        print("-> Bereinige ungültige 'string' Werte in profile_image_path...")
        cursor.execute("UPDATE authors SET profile_image_path = NULL WHERE profile_image_path = 'string'")

        # 5. INITIALE DATEN: LinkTypes befüllen (Website ist Pflicht für dein DTO)
        print("-> Stelle Standard-LinkTypes sicher...")
        cursor.execute("INSERT OR IGNORE INTO link_types (id, name) VALUES (1, 'Website')")
        cursor.execute("INSERT OR IGNORE INTO link_types (name) VALUES ('Instagram')")
        cursor.execute("INSERT OR IGNORE INTO link_types (name) VALUES ('LinkedIn')")

        conn.commit()
        print("--- Migration erfolgreich abgeschlossen! ---")

    except Exception as e:
        print(f"KRITISCHER FEHLER bei der Migration: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    run_migration()