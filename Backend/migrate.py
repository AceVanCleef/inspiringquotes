import sqlite3

def run_migration():
    db_name = 'inspiring_quotes.db'
    try:
        conn = sqlite3.connect(db_name)
        cursor = conn.cursor()

        print("Starte Migration auf das neue Schema...")

        # 1. 'bio' zu 'authors' hinzufügen
        try:
            cursor.execute('ALTER TABLE authors ADD COLUMN bio VARCHAR(500)')
            print("- Spalte 'bio' zur Tabelle 'authors' hinzugefügt.")
        except sqlite3.OperationalError:
            print("- Info: Spalte 'bio' existiert bereits.")

        # 2. 'link_types' Tabelle erstellen
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS link_types (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(50) UNIQUE NOT NULL
            )
        ''')
        print("- Tabelle 'link_types' ist bereit.")

        # 3. Initial-Daten für LinkTypes einfügen
        platforms = ['Instagram', 'TikTok', 'LinkedIn', 'YouTube', 'X', 'Website', 'Facebook']
        for p in platforms:
            cursor.execute('INSERT OR IGNORE INTO link_types (name) VALUES (?)', (p,))
        print(f"- Standard-Plattformen ({', '.join(platforms)}) sichergestellt.")

        # 4. 'label' zu 'author_links' hinzufügen
        try:
            cursor.execute('ALTER TABLE author_links ADD COLUMN label VARCHAR(50)')
            print("- Spalte 'label' zur Tabelle 'author_links' hinzugefügt.")
        except sqlite3.OperationalError:
            print("- Info: Spalte 'label' existiert bereits.")

        # 5. 'link_type_id' zu 'author_links' hinzufügen
        try:
            cursor.execute('ALTER TABLE author_links ADD COLUMN link_type_id INTEGER REFERENCES link_types(id)')
            print("- Spalte 'link_type_id' zur Tabelle 'author_links' hinzugefügt.")
        except sqlite3.OperationalError:
            print("- Info: Spalte 'link_type_id' existiert bereits.")

        # 6. 'platform' Spalte entfernen (Optional / Sauberkeit)
        # SQLite unterstützt DROP COLUMN erst ab Version 3.35.0 (März 2021)
        try:
            cursor.execute('ALTER TABLE author_links DROP COLUMN platform')
            print("- Alte Spalte 'platform' entfernt.")
        except sqlite3.OperationalError:
            print("- Info: Alte Spalte 'platform' konnte nicht entfernt werden (evtl. SQLite Version zu alt), kein Problem.")

        conn.commit()
        conn.close()
        print("\nMigration erfolgreich abgeschlossen! Deine Datenbank ist jetzt auf dem neuesten Stand.")

    except Exception as e:
        print(f"\nFehler während der Migration: {e}")

if __name__ == "__main__":
    run_migration()