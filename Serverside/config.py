from dotenv import load_dotenv
import os
import redis
load_dotenv()
class ApplicationConfig:
    SECRET_KEY=os.environ["SECRET_KEY"]
    DB_PASSWORD = os.environ.get("DB_PASSWORD", "")

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO =True
    SQLALCHEMY_DATABASE_URI =f'postgresql://postgres:{DB_PASSWORD}@localhost/truthGuard'

    SESSION_TYPE="redis"
    SESSION_PERMANENT=False
    SESSION_USE_SIGNER=True
    SESSION_REDIS=redis.from_url("redis://127.0.0.1:6379")
