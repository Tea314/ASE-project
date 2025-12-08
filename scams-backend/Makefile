docker-up:
	docker-compose -f ./docker-compose.yml up -d
docker-down:
	docker-compose -f ./docker-compose.yml down
run-backend:
	poetry run uvicorn scams_backend.main:app --reload
migrate:
	poetry run alembic upgrade head