from fastapi import FastAPI, HTTPException, Query
from settings import Settings
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
async def weather(
    latitude: float = Query(ge=-90, le=90),
    longitude: float = Query(ge=-180, le=180),
):
    settings = Settings()
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "timezone": "auto",
        "current": (
            "temperature_2m,relative_humidity_2m,apparent_temperature,"
            "weather_code,wind_speed_10m"
        ),
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                settings.weather_endpoint,
                params=params,
                timeout=10.0,
            )
            response.raise_for_status()
            return response.json()

        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="Weather API timed out")

        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=e.response.text)

        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Could not reach weather API: {str(e)}")
