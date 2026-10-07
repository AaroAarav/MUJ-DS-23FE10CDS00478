from fastapi.testclient import TestClient
from app.main import app
import io

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Resume to Portfolio API is running." in response.text

def test_generate_portfolio_unsupported_file():
    # Test that an unsupported file extension returns 400
    file_content = b"This is a fake text file, which is unsupported."
    files = {"file": ("test.txt", io.BytesIO(file_content), "text/plain")}
    data = {
        "theme": "Professional",
        "features": "",
        "model": "ollama"
    }
    
    response = client.post("/generate-portfolio-code/", files=files, data=data)
    assert response.status_code == 400
    assert response.json()["detail"] == "Unsupported file type"
