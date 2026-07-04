from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    weather_endpoint: str = "https://api.open-meteo.com/v1/forecast"
