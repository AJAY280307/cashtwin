import os
from fastapi import APIRouter, HTTPException
from schemas.api import CustomerListResponse, CompleteAnalysisResponse
from schemas.simulation import Intervention, SimulationResult
from services.customer_loader import CustomerLoader
from services.risk_engine import RiskEngine
from services.forecast_engine import ForecastEngine
from services.explanation_engine import ExplanationEngine
from services.recommendation_engine import RecommendationEngine
from services.simulator import SimulatorEngine

router = APIRouter(prefix="/api/customers", tags=["customers"])

risk_engine = RiskEngine(model_dir="models")
forecast_engine = ForecastEngine()
explanation_engine = ExplanationEngine()
recommendation_engine = RecommendationEngine()
simulator_engine = SimulatorEngine(model_dir="models")

@router.get("", response_model=CustomerListResponse)
async def list_customers():
    try:
        customers = CustomerLoader.get_customers()
        return CustomerListResponse(customers=customers)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load customers: {str(e)}")

@router.get("/{customer_id}/analysis", response_model=CompleteAnalysisResponse)
async def get_customer_analysis(customer_id: str):
    customer = CustomerLoader.get_customer(customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
        
    try:
        # 1. Health and Risk
        health_result = risk_engine.evaluate_customer(customer)
        
        # 2. Forecast
        forecast_result = None
        try:
            forecast_result = forecast_engine.forecast_customer(
                customer, horizon_days=30, scenario="BASELINE"
            )
        except Exception:
            pass # Keep forecast as None if it fails
            
        # 3. Explanation
        explanation_result = explanation_engine.build_explanation(
            customer, health_result, forecast_result
        )
        
        # 4. Recommendations
        recommendation_result = recommendation_engine.build_recommendations(
            customer, explanation_result
        )
        
        return CompleteAnalysisResponse(
            customer=customer,
            financial_health=health_result,
            forecast=forecast_result,
            explanation=explanation_result,
            recommendations=recommendation_result
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/{customer_id}/simulate", response_model=SimulationResult)
async def simulate_intervention(customer_id: str, intervention: Intervention):
    customer = CustomerLoader.get_customer(customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
        
    try:
        result = simulator_engine.simulate(customer, intervention)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")
