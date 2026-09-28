import requests


OLLAMA_URL = "http://localhost:11434/api/generate"

MODEL_NAME = "llama3.2"


def analyze_with_ai(resume_text, job_description):

    prompt = f"""
You are a professional resume analyzer.

Analyze the following resume against the job description.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

Give the answer in this format:

1. Resume Strengths
2. Missing Skills
3. Resume Improvement Suggestions
4. Overall Feedback

Keep the response practical and concise.
"""

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": False
        }
    )

    response.raise_for_status()

    data = response.json()

    return data["response"]