# API Documentation — Portfolio Rebalancing Backend

**Base URL**: `http://localhost:5000`

---

## 1. GET /holdings

**Description**: Fetch all current holdings for client Amit Sharma (C001).

**Method**: `GET`  
**URL**: `http://localhost:5000/holdings`  
**Headers**: None required  
**Body**: None

**Example Response**:
```json
[
  { "holding_id": 1, "client_id": "C001", "fund_id": "F001", "fund_name": "Mirae Asset Large Cap Fund", "current_value": 90000 },
  { "holding_id": 2, "client_id": "C001", "fund_id": "F002", "fund_name": "Parag Parikh Flexi Cap Fund", "current_value": 155000 },
  { "holding_id": 3, "client_id": "C001", "fund_id": "F003", "fund_name": "HDFC Mid Cap Opportunities Fund", "current_value": 0 },
  { "holding_id": 4, "client_id": "C001", "fund_id": "F004", "fund_name": "ICICI Prudential Bond Fund", "current_value": 110000 },
  { "holding_id": 5, "client_id": "C001", "fund_id": "F005", "fund_name": "Nippon India Gold ETF", "current_value": 145000 },
  { "holding_id": 6, "client_id": "C001", "fund_id": "F006", "fund_name": "Axis Bluechip Fund", "current_value": 80000 }
]
```

---

## 2. GET /model

**Description**: Fetch the advisor's recommended model portfolio (target allocations).

**Method**: `GET`  
**URL**: `http://localhost:5000/model`  
**Headers**: None required  
**Body**: None

**Example Response**:
```json
[
  { "fund_id": "F001", "fund_name": "Mirae Asset Large Cap Fund", "asset_class": "EQUITY", "allocation_pct": 30 },
  { "fund_id": "F002", "fund_name": "Parag Parikh Flexi Cap Fund", "asset_class": "EQUITY", "allocation_pct": 25 },
  { "fund_id": "F003", "fund_name": "HDFC Mid Cap Opportunities Fund", "asset_class": "EQUITY", "allocation_pct": 20 },
  { "fund_id": "F004", "fund_name": "ICICI Prudential Bond Fund", "asset_class": "DEBT", "allocation_pct": 15 },
  { "fund_id": "F005", "fund_name": "Nippon India Gold ETF", "asset_class": "GOLD", "allocation_pct": 10 }
]
```

---

## 3. POST /model

**Description**: Update target allocations in the model portfolio. All percentages must sum to exactly 100%.

**Method**: `POST`  
**URL**: `http://localhost:5000/model`  
**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "updates": [
    { "fund_id": "F001", "allocation_pct": 30 },
    { "fund_id": "F002", "allocation_pct": 25 },
    { "fund_id": "F003", "allocation_pct": 20 },
    { "fund_id": "F004", "allocation_pct": 15 },
    { "fund_id": "F005", "allocation_pct": 10 }
  ]
}
```

**Success Response** (200):
```json
{ "message": "Model portfolio updated successfully!" }
```

**Error Response** (400) — if sum ≠ 100:
```json
{ "error": "Total allocation must equal 100%. Currently 95%" }
```

---

## 4. GET /rebalance

**Description**: The main endpoint. Fetches holdings and model, runs the full rebalance calculation, and returns BUY/SELL/REVIEW recommendations with rupee amounts.

**Method**: `GET`  
**URL**: `http://localhost:5000/rebalance`  
**Headers**: None required  
**Body**: None

**Example Response**:
```json
{
  "portfolio_value": 580000,
  "total_buy": 200000,
  "total_sell": 120000,
  "fresh_money_needed": 80000,
  "items": [
    {
      "fund_id": "F001",
      "fund_name": "Mirae Asset Large Cap Fund",
      "current_pct": 15.517241379310345,
      "target_pct": 30,
      "drift": 14.482758620689655,
      "action": "BUY",
      "amount": 84000,
      "is_model_fund": 1
    },
    {
      "fund_id": "F002",
      "fund_name": "Parag Parikh Flexi Cap Fund",
      "current_pct": 26.724137931034484,
      "target_pct": 25,
      "drift": -1.7241379310344827,
      "action": "SELL",
      "amount": 10000,
      "is_model_fund": 1
    },
    {
      "fund_id": "F003",
      "fund_name": "HDFC Mid Cap Opportunities Fund",
      "current_pct": 0,
      "target_pct": 20,
      "drift": 20,
      "action": "BUY",
      "amount": 116000,
      "is_model_fund": 1
    },
    {
      "fund_id": "F004",
      "fund_name": "ICICI Prudential Bond Fund",
      "current_pct": 18.96551724137931,
      "target_pct": 15,
      "drift": -3.9655172413793105,
      "action": "SELL",
      "amount": 23000,
      "is_model_fund": 1
    },
    {
      "fund_id": "F005",
      "fund_name": "Nippon India Gold ETF",
      "current_pct": 25,
      "target_pct": 10,
      "drift": -15,
      "action": "SELL",
      "amount": 87000,
      "is_model_fund": 1
    },
    {
      "fund_id": "F006",
      "fund_name": "Axis Bluechip Fund",
      "action": "REVIEW",
      "amount": 80000,
      "is_model_fund": 0
    }
  ]
}
```

---

## 5. POST /save

**Description**: Saves the current rebalance recommendation to the database. Creates one session record and one item record per fund.

**Method**: `POST`  
**URL**: `http://localhost:5000/save`  
**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "portfolio_value": 580000,
  "total_buy": 200000,
  "total_sell": 120000,
  "fresh_money_needed": 80000,
  "items": [
    {
      "fund_id": "F001",
      "fund_name": "Mirae Asset Large Cap Fund",
      "action": "BUY",
      "amount": 84000,
      "current_pct": 15.52,
      "target_pct": 30,
      "post_rebalance_pct": 30,
      "is_model_fund": 1
    },
    {
      "fund_id": "F002",
      "fund_name": "Parag Parikh Flexi Cap Fund",
      "action": "SELL",
      "amount": 10000,
      "current_pct": 26.72,
      "target_pct": 25,
      "post_rebalance_pct": 25,
      "is_model_fund": 1
    },
    {
      "fund_id": "F003",
      "fund_name": "HDFC Mid Cap Opportunities Fund",
      "action": "BUY",
      "amount": 116000,
      "current_pct": 0,
      "target_pct": 20,
      "post_rebalance_pct": 20,
      "is_model_fund": 1
    },
    {
      "fund_id": "F004",
      "fund_name": "ICICI Prudential Bond Fund",
      "action": "SELL",
      "amount": 23000,
      "current_pct": 18.97,
      "target_pct": 15,
      "post_rebalance_pct": 15,
      "is_model_fund": 1
    },
    {
      "fund_id": "F005",
      "fund_name": "Nippon India Gold ETF",
      "action": "SELL",
      "amount": 87000,
      "current_pct": 25,
      "target_pct": 10,
      "post_rebalance_pct": 10,
      "is_model_fund": 1
    },
    {
      "fund_id": "F006",
      "fund_name": "Axis Bluechip Fund",
      "action": "REVIEW",
      "amount": 80000,
      "current_pct": 13.79,
      "target_pct": 0,
      "post_rebalance_pct": 13.79,
      "is_model_fund": 0
    }
  ]
}
```

**Success Response** (200):
```json
{ "message": "Rebalance saved", "sessionId": 1 }
```

**Error Response** (500):
```json
{ "error": "Failed to save rebalance" }
```

---

## 6. GET /history

**Description**: Fetch all past saved rebalance sessions, ordered by date (latest first).

**Method**: `GET`  
**URL**: `http://localhost:5000/history`  
**Headers**: None required  
**Body**: None

**Example Response**:
```json
[
  {
    "session_id": 2,
    "client_id": "C001",
    "created_at": "2026-03-16 08:05:00",
    "portfolio_value": 580000,
    "total_to_buy": 200000,
    "total_to_sell": 120000,
    "net_cash_needed": 80000,
    "status": "PENDING"
  },
  {
    "session_id": 1,
    "client_id": "C001",
    "created_at": "2026-03-16 07:30:00",
    "portfolio_value": 580000,
    "total_to_buy": 200000,
    "total_to_sell": 120000,
    "net_cash_needed": 80000,
    "status": "PENDING"
  }
]
```

---

## Quick Reference

| # | Method | Endpoint | Purpose |
|---|---|---|---|
| 1 | GET | `/holdings` | View client's current fund holdings |
| 2 | GET | `/model` | View advisor's target allocations |
| 3 | POST | `/model` | Update target allocations |
| 4 | GET | `/rebalance` | Get BUY/SELL/REVIEW recommendations |
| 5 | POST | `/save` | Save recommendation to DB |
| 6 | GET | `/history` | View past saved recommendations |

---

## Postman Setup Tips

1. Create a new **Collection** called `Valuefy Portfolio API`
2. Set a **Collection Variable**: `base_url = http://localhost:5000`
3. Use `{{base_url}}/holdings` in each request URL
4. For POST requests, set **Body → raw → JSON**
5. Make sure the backend is running (`nodemon server.js` in `/backend`)
