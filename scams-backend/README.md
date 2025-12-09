# Smart Campus System Backend

## Local Development Setup

### Prerequisites

- Python 3.8 or newer (recommend [pyenv](https://github.com/pyenv/pyenv) or system Python)
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
docker-compose up -d
```

### 5. Run database migrations

```bash

# Using Makefile
make migrate
# Or directly
poetry run alembic upgrade head
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

- Stop database: `poetry run make docker-down` or `docker-compose down`
- Reinstall dependencies: `poetry install`
- Add a package: `poetry add <package>`

### Troubleshooting

- Ensure PostgreSQL is running (`docker ps`)
- Check `.env` for correct DB credentials
- If migrations fail, check Alembic config and DB connection

---

For more details, see the documentation in each source folder.
