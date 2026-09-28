import sqlite3

DATABASE_NAME = "resume_analyzer.db"


def get_connection():
    connection = sqlite3.connect(DATABASE_NAME)
    connection.row_factory = sqlite3.Row
    return connection


def create_table():
    connection = get_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS analyses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            resume_name TEXT NOT NULL,
            job_description TEXT NOT NULL,
            match_score REAL NOT NULL,
            matching_keywords TEXT,
            missing_keywords TEXT,
            ai_feedback TEXT
        )
    """)

    connection.commit()
    connection.close()


def save_analysis(
    resume_name,
    job_description,
    match_score,
    matching_keywords,
    missing_keywords,
    ai_feedback
):
    connection = get_connection()

    connection.execute("""
        INSERT INTO analyses (
            resume_name,
            job_description,
            match_score,
            matching_keywords,
            missing_keywords,
            ai_feedback
        )
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        resume_name,
        job_description,
        match_score,
        matching_keywords,
        missing_keywords,
        ai_feedback
    ))

    connection.commit()
    connection.close()
