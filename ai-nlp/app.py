import spacy
from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json
import re

app = Flask(__name__)

# Load spaCy models
try:
    nlp_en = spacy.load("en_core_web_sm")
    nlp_fr = spacy.load("fr_core_news_sm")
except:
    # Fallback if models are not loaded correctly
    nlp_en = None
    nlp_fr = None

# Predefined skills list (expanded)
SKILLS_DB = [
    "java", "spring boot", "hibernate", "mysql", "postgresql", "mongodb", "react", "angular", "vue.js",
    "javascript", "typescript", "html", "css", "bootstrap", "tailwind", "python", "django", "flask",
    "fastapi", "machine learning", "data science", "nlp", "scikit-learn", "tensorflow", "pytorch",
    "docker", "kubernetes", "aws", "azure", "gcp", "devops", "ci/cd", "git", "rest api", "graphql",
    "node.js", "express", "php", "laravel", "symfony", "ruby", "rails", "go", "rust", "c++", "c#",
    "swift", "kotlin", "flutter", "react native", "agile", "scrum", "project management"
]

def preprocess_text(text):
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    return text

def extract_skills_from_text(text):
    if not text:
        return []
    
    processed_text = preprocess_text(text)
    found_skills = []
    
    for skill in SKILLS_DB:
        # Match whole word only
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, processed_text):
            found_skills.append(skill)
            
    return list(set(found_skills))

@app.route('/extract-skills', methods=['POST'])
def extract_skills():
    data = request.json
    text = data.get('text', '')
    skills = extract_skills_from_text(text)
    return jsonify({"skills": json.dumps(skills)})

@app.route('/calculate-match', methods=['POST'])
def calculate_match():
    data = request.json
    cv_skills = json.loads(data.get('cv_skills', '[]'))
    job_skills = json.loads(data.get('job_skills', '[]'))
    
    if not job_skills:
        return jsonify({"score": 0.0})
    
    matched_skills = [skill for skill in cv_skills if skill in job_skills]
    score = (len(matched_skills) / len(job_skills)) * 100
    
    return jsonify({"score": round(score, 2)})

@app.route('/match-details', methods=['POST'])
def match_details():
    data = request.json
    cv_skills = json.loads(data.get('cv_skills', '[]'))
    job_skills = json.loads(data.get('job_skills', '[]'))
    
    if not job_skills:
        return jsonify({
            "score": 0.0,
            "matched_skills": "[]",
            "missing_skills": "[]"
        })
    
    matched = [skill for skill in cv_skills if skill in job_skills]
    missing = [skill for skill in job_skills if skill not in cv_skills]
    
    score = (len(matched) / len(job_skills)) * 100
    
    return jsonify({
        "score": round(score, 2),
        "matched_skills": json.dumps(matched),
        "missing_skills": json.dumps(missing)
    })

@app.route('/cosine-similarity', methods=['POST'])
def calculate_cosine_similarity():
    data = request.json
    text1 = data.get('text1', '')
    text2 = data.get('text2', '')
    
    if not text1 or not text2:
        return jsonify({"similarity": 0.0})
    
    vectorizer = TfidfVectorizer()
    tfidf = vectorizer.fit_transform([text1, text2])
    similarity = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
    
    return jsonify({"similarity": round(float(similarity) * 100, 2)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
