from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

import fitz
import os
import json

from backend.database import create_table, save_analysis
from backend.analyzer import analyze_keywords


app = FastAPI(
    title="AI Resume Analyzer",
    description="Analyze resumes against job descriptions using Python and AI."
)


# Create database table when application starts
create_table()


# Serve frontend
app.mount(
    "/static",
    StaticFiles(directory="frontend"),
    name="static"
)


# Home page
@app.get("/")
def home():
    return FileResponse("frontend/index.html")


# Resume analysis endpoint
@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):

    # Check file type
    if resume.content_type != "application/pdf":
        return {
            "success": False,
            "message": "Please upload a PDF resume."
        }

    # Read uploaded PDF
    pdf_bytes = await resume.read()

    # Open PDF using PyMuPDF
    document = fitz.open(
        stream=pdf_bytes,
        filetype="pdf"
    )

    resume_text = ""

    for page in document:
        resume_text += page.get_text()

    document.close()

    # Make sure PDF contains text
    if not resume_text.strip():
        return {
            "success": False,
            "message": "Could not extract text from this PDF."
        }

    # Analyze resume
    analysis = analyze_keywords(
        resume_text,
        job_description
    )

    # Save result
    save_analysis(
        resume.filename,
        job_description,
        analysis["score"],
        json.dumps(analysis["matching_keywords"]),
        json.dumps(analysis["missing_keywords"]),
        ""
    )

    return {
        "success": True,
        "resume_name": resume.filename,
        "score": analysis["score"],
        "matching_keywords": analysis["matching_keywords"],
        "missing_keywords": analysis["missing_keywords"]
    }