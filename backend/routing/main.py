from fastapi import FastAPI, HTTPException
from settings import Settings
from datetime import datetime
import zoneinfo
import httpx
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/weather/currentlocation")
async def weather(lat: str, long: str,):
    settings = Settings()
    url = f"{settings.weather_endpoint}?latitude={lat}&longitude={long}&timezone=auto&hourly=temperature_2m"
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, timeout=10.0)
            response.raise_for_status()             # throws on 4xx / 5xx
            return response.json()

        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="Weather API timed out")

        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=e.response.text)

        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Could not reach weather API: {str(e)}")
    return {"message": "Unkown error occurred"}