import sqlite3

def add_likes_column():
    try:
        # Verbindung zur Datenbankdatei herstellen
        conn = sqlite3.connect('inspiring_quotes.db')
        cursor = conn.cursor()

        print("Füge Spalte 'likes' zur Tabelle 'quotes' hinzu...")
        
        # Der SQL Befehl
        cursor.execute('ALTER TABLE quotes ADD COLUMN likes INTEGER DEFAULT 0')
        
        conn.commit()
        conn.close()
        print("Erfolg! Die Spalte wurde hinzugefügt, deine Zitate sind sicher.")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print("Info: Die Spalte 'likes' existiert bereits.")
        else:
            print(f"Fehler: {e}")
    except Exception as e:
        print(f"Unerwarteter Fehler: {e}")

if __name__ == "__main__":
    add_likes_column()