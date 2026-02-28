from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
from prophet import Prophet
import datetime
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DataPoint(BaseModel):
    date: str
    value: float

class ForecastRequest(BaseModel):
    history: List[DataPoint]
    periods: int = 4

class ForecastResponse(BaseModel):
    forecast: List[DataPoint]

@app.post("/forecast", response_model=ForecastResponse)
def generate_forecast(req: ForecastRequest):
    if len(req.history) < 2:
        raise HTTPException(status_code=400, detail="Not enough history data for forecasting")
    
    # Convert to pandas dataframe
    df = pd.DataFrame([{"ds": d.date, "y": d.value} for d in req.history])
    df['ds'] = pd.to_datetime(df['ds'])
    
    # Fit Prophet model
    m = Prophet(weekly_seasonality=False, daily_seasonality=False, yearly_seasonality=False)
    m.fit(df)
    
    # Make future dataframe (frequency='W' for weekly)
    future = m.make_future_dataframe(periods=req.periods, freq='W')
    
    # Predict
    forecast = m.predict(future)
    
    # Extract only the forecasted part
    forecast_out = forecast.tail(req.periods)
    
    res = []
    for _, row in forecast_out.iterrows():
        res.append(DataPoint(
            date=row['ds'].strftime("%Y-%m-%d"),
            value=max(0, float(row['yhat']))  # Replace negatives with 0 if needed
        ))
        
    return ForecastResponse(forecast=res)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5002)
