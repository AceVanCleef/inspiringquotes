import sqlite3

def run_migration():
    db_name = 'inspiring_quotes.db'
    # Verbindung zur Datenbank herstellen
    # Stelle sicher, dass der Pfad zu deiner aktuellen .db Datei stimmt!
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    print("Starte Migration: Spalte 'profile_image_path' wird hinzugefügt...")

    try:
        # Der SQL-Befehl zum Hinzufügen der Spalte
        # Wir setzen keinen NOT NULL Constraint, da das Feld optional ist
        cursor.execute("ALTER TABLE authors ADD COLUMN profile_image_path VARCHAR(255)")
        
        conn.commit()
        print("Erfolg: Spalte wurde erfolgreich zur Tabelle 'authors' hinzugefügt.")
    
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e).lower():
            print("Hinweis: Die Spalte existiert bereits. Keine Änderung nötig.")
        else:
            print(f"Fehler bei der Migration: {e}")
    
    finally:
        conn.close()

if __name__ == "__main__":
    run_migration()

if __name__ == "__main__":
    run_migration()