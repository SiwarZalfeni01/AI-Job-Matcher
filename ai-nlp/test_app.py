import pytest
import json
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_extract_skills(client):
    data = {"text": "I am a Java developer with experience in Spring Boot and MySQL."}
    response = client.post('/extract-skills', 
                           data=json.dumps(data),
                           content_type='application/json')
    
    assert response.status_code == 200
    res_data = json.loads(response.data)
    skills = json.loads(res_data['skills'])
    
    assert "java" in skills
    assert "spring boot" in skills
    assert "mysql" in skills

def test_calculate_match(client):
    data = {
        "cv_skills": json.dumps(["java", "spring boot", "mysql", "react"]),
        "job_skills": json.dumps(["java", "spring boot", "mysql", "docker"])
    }
    response = client.post('/calculate-match', 
                           data=json.dumps(data),
                           content_type='application/json')
    
    assert response.status_code == 200
    res_data = json.loads(response.data)
    # 3 matched skills out of 4 job skills = 75.0
    assert res_data['score'] == 75.0

def test_match_details(client):
    data = {
        "cv_skills": json.dumps(["java", "spring boot"]),
        "job_skills": json.dumps(["java", "spring boot", "docker"])
    }
    response = client.post('/match-details', 
                           data=json.dumps(data),
                           content_type='application/json')
    
    assert response.status_code == 200
    res_data = json.loads(response.data)
    
    assert res_data['score'] == pytest.approx(66.67, 0.01)
    matched = json.loads(res_data['matched_skills'])
    missing = json.loads(res_data['missing_skills'])
    
    assert "java" in matched
    assert "spring boot" in matched
    assert "docker" in missing

def test_cosine_similarity(client):
    data = {
        "text1": "java developer spring boot",
        "text2": "java developer spring boot"
    }
    response = client.post('/cosine-similarity', 
                           data=json.dumps(data),
                           content_type='application/json')
    
    assert response.status_code == 200
    res_data = json.loads(response.data)
    assert res_data['similarity'] == 100.0
