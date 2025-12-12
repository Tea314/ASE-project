# Smart Campus System Backend

## Local Development Setup

### Prerequisites

- Python 3.10 or newer (recommend [pyenv](https://github.com/pyenv/pyenv) or system Python)
- [Poetry](https://python-poetry.org/) for dependency management
- Docker (for PostgreSQL database)

### 1. Clone the repository

```bash
git clone https://github.com/Tea314/ASE-project.git
cd scams-backend
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and update values as needed:

```bash
cp .env.example .env
```

### 3. Install dependencies

```bash
poetry install
```

### 4. Start PostgreSQL with Docker

```bash
docker-compose up -d

# Using Makefile
make docker-up
# Or directly
docker-compose -f ./docker/docker-compose.yml up -d
```

### 5. Setup database (migration and seeding)

```bash

# Using Makefile
make setup
# Or directly
docker exec -i postgres-db psql -U your_user -d template1 -c "DROP DATABASE IF EXISTS postgres;"
docker exec -i postgres-db psql -U your_user -d template1 -c "CREATE DATABASE postgres;"
poetry run alembic upgrade head
poetry run python scripts/seed.py
```

### 6. Start the backend server

```bash

# Using Makefile
make run-backend
# Or directly
poetry run uvicorn src.scams_backend.main:app --reload
```

- The API will be available at `http://localhost:8000`
- Interactive docs: `http://localhost:8000/docs`

### Common commands

- Stop database: `make docker-down` or `docker-compose -f ./docker/docker-compose.yml down`
- Reinstall dependencies: `poetry install`
- Add a package: `poetry add <package>`

### Troubleshooting

- Ensure PostgreSQL is running (`docker ps`)
- Check `.env` for correct DB credentials
- If migrations fail, check Alembic config and DB connection

---
