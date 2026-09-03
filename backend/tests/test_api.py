from fastapi.testclient import TestClient
from main import app
from services.customer_loader import CustomerLoader

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_get_customers():
    response = client.get("/api/customers")
    assert response.status_code == 200
    data = response.json()
    assert "customers" in data
    assert len(data["customers"]) > 0
    assert "user_id" in data["customers"][0]
    assert "display_name" in data["customers"][0]

def test_get_customer_analysis():
    # Grab a real customer from the loader to ensure a valid ID
    customers = CustomerLoader.get_customers(limit=1)
    if not customers:
        pytest.skip("No customers found in dataset")
        
    customer_id = customers[0]["user_id"]
    response = client.get(f"/api/customers/{customer_id}/analysis")
    assert response.status_code == 200
    data = response.json()
    
    assert "customer" in data
    assert "financial_health" in data
    assert "forecast" in data
    assert "explanation" in data
    assert "recommendations" in data
    
    assert data["customer"]["user_id"] == customer_id

def test_get_customer_analysis_not_found():
    response = client.get("/api/customers/invalid_fake_id_12345/analysis")
    assert response.status_code == 404
    assert response.json()["detail"] == "Customer not found"

def test_simulate_intervention():
    customers = CustomerLoader.get_customers(limit=1)
    if not customers:
        pytest.skip("No customers found in dataset")
        
    customer_id = customers[0]["user_id"]
    intervention = {
        "reduce_expenses_by": 500.0,
        "reduce_emi_by": 0,
        "increase_savings_by": 1000.0,
        "increase_income_by": 0
    }
    
    response = client.post(f"/api/customers/{customer_id}/simulate", json=intervention)
    assert response.status_code == 200
    data = response.json()
    
    assert "baseline_risk_level" in data
    assert "simulated_risk_level" in data
    assert "baseline_resilience_score" in data
    assert "simulated_resilience_score" in data
    assert "impacts" in data
    assert "summary" in data

def test_simulate_intervention_invalid_input():
    customers = CustomerLoader.get_customers(limit=1)
    if not customers:
        pytest.skip("No customers found in dataset")
        
    customer_id = customers[0]["user_id"]
    intervention = {
        "reduce_expenses_by": "not_a_number"
    }
    
    response = client.post(f"/api/customers/{customer_id}/simulate", json=intervention)
    assert response.status_code == 422 # Pydantic validation error
