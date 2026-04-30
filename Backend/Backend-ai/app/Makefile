run:
	uvicorn main:app --reload
build:
	docker build -t bwibow/fastapi-ai:0.2 .
docrun:
	docker run -p 8000:8000 bwibow/fastapi-ai:0.2
docpush:
	docker push bwibow/fastapi-ai:0.2