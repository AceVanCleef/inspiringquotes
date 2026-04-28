Python in Virtual Environment:
https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/#create-and-use-virtual-environments

Update requirements.txt (After installing / uninstalling pip packages):
pip freeze > requirements.txt

# Run local web server
.\.venv\Scripts\activate
uvicorn main:app --reload

Then open http://127.0.0.1:8000/

To manipulate data, open http://127.0.0.1:8000/docs 

# Run Backend containerized in Docker
Run backend as a local docker image:
docker-compose up --build

To manipulate data, open http://127.0.0.1:8080/docs 
