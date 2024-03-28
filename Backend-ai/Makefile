run:
	uvicorn main:app --reload
build:
	docker build -t bwibow/fastapi-ai:0.3 .
	docker login
	docker push -t bwibow/fastapi-ai:0.3 .
docrun:
	docker run -p 8000:8000 bwibow/fastapi-ai:0.2
