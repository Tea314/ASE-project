from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    # Database settings
    DB_USER: str = "your_user"
    DB_PASSWORD: str = "your_password"
    DB_HOST: str = "localhost"
    DB_PORT: int = 5433
    DB_NAME: str = "postgres"

    SECRET_KEY: str = "your_secret_key"
    JWT_ALGORITHM: str = "HS256"
    AES_KEY: str = "your_aes_key"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
