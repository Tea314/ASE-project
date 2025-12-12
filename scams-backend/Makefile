docker-up:
	docker-compose -f ./docker/docker-compose.yml up -d
docker-down:
	docker-compose -f ./docker/docker-compose.yml down
run-backend:
	poetry run uvicorn scams_backend.main:app --reload
migrate:
	poetry run alembic upgrade head
reset-db:
	docker exec -i postgres-db psql -U your_user -d template1 -c "DROP DATABASE IF EXISTS postgres;"
	docker exec -i postgres-db psql -U your_user -d template1 -c "CREATE DATABASE postgres;"
seed:
	poetry run python scripts/seed.py
setup: reset-db migrate seed