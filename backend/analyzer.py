import re


STOP_WORDS = {
    "the", "and", "for", "with", "that", "this",
    "from", "you", "your", "are", "will",
    "our", "have", "has", "job", "work",
    "using", "years", "role", "about",
    "into", "their", "they", "them",
    "who", "what", "where", "when",
    "which", "while", "should", "would",
    "could", "can", "able", "been"
}


def extract_keywords(text):
    text = text.lower()

    words = re.findall(
        r"\b[a-zA-Z][a-zA-Z+#.-]*\b",
        text
    )

    keywords = set()

    for word in words:
        if word not in STOP_WORDS and len(word) > 2:
            keywords.add(word)

    return keywords


def analyze_keywords(resume_text, job_description):

    resume_keywords = extract_keywords(resume_text)

    job_keywords = extract_keywords(job_description)

    matching_keywords = resume_keywords.intersection(
        job_keywords
    )

    missing_keywords = job_keywords - resume_keywords

    if len(job_keywords) == 0:
        score = 0
    else:
        score = (
            len(matching_keywords)
            / len(job_keywords)
        ) * 100

    return {
        "score": round(score, 2),
        "matching_keywords": sorted(matching_keywords),
        "missing_keywords": sorted(missing_keywords)
    }


