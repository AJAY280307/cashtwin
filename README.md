# CashTwin — AI-Powered Financial Distress Prevention Platform

### *Your AI Financial Twin. Predict Early. Prevent Financial Crisis.*

> **Main Concept:** CashTwin detects financial distress early. Bachat Mitra helps the user take action.
> **Ethical Banking Principle:** CashTwin is built exclusively for early intervention and support. It does **NOT** report distress to credit bureaus, charge penalty fees, or sell predatory high-interest loans.

---

## 👥 Team & Hackathon

Built with ❤️ for **Innovation Unbound**:
* **Ajay**
* **Lidiya**
* **Archana**

---

## 💡 Problem Statement & Vision

### Preventing Financial Distress Before It Becomes a Crisis
Traditional banking systems are reactive:
```
Financial Crisis → Missed Payments → Loan Default → Collections / Penalties
```
By the time fees or default notices arrive, the customer is already locked into distress.

**CashTwin introduces proactive financial healthcare**:
```
Early Signals → Detection → Risk Analysis → Personalized Interventions → Bachat Mitra Guidance → Crisis Prevented
```

How might banks responsibly identify early signs of financial distress and provide personalized interventions that help customers avoid excessive debt, loan defaults, and financial exclusion?

Financial distress begins weeks before a missed payment or loan default:
* Declining account balances and shrinking liquidity buffer
* Silent discretionary spending and subscription creep
* Elevated contractual EMI burden
* Emergency savings drawdown
* Repeat overdrafts and reliance on high-frequency borrowing

CashTwin monitors these signals in real time, alerts the user, and guides recovery through **Bachat Mitra**.

---

## 🚀 Key Platform Features

### 1. 📈 Financial Journey Timeline
- **Page:** `#/timeline`
- **Description:** Tracks how the user's financial health changes month-over-month.
- **Milestones:** Displays a 5-month longitudinal arc (*January — Healthy* &rarr; *February — Stable* &rarr; *March — Early Warning* &rarr; *April — Moderate Risk* &rarr; *May — Intervention Recommended*).
- **Visuals:** Interactive month selection cards, Recharts Area Trend Chart, inflow/outflow delta bars, and proactive diagnosis cards.

### 2. 🎛️ Interactive What-If Scenario Simulator
- **Page:** `#/simulator`
- **Description:** Real-time testbed for evaluating financial shocks and interventions.
- **5 Core Scenarios:**
  - *What if I lose 20% of my income?* (Income shock slider 0–50%)
  - *What if my EMI increases?* (Simulates interest rate spikes / loan tenure extension)
  - *What if I reduce my monthly expenses?* (Discretionary spending cuts)
  - *What if I save ₹5,000 more every month?* (Surplus emergency replenishment)
  - *What happens if I make a large purchase?* (₹10,000 / ₹25,000 upfront liquidity drawdown)
- **Side-by-Side Comparison:** Current Health vs Simulated Health, Risk Score Delta, Monthly Savings Impact, Financial Pressure Gauge (Low / Moderate / High / Severe), and Emergency Runway Days remaining.

### 3. 🔥 Financial Stress Heatmap
- **Page:** `#/heatmap`
- **Description:** Visual diagnostic tool answering *"Which part of my financial life needs attention?"*
- **8 Core Categories:**
  1. Income Stability
  2. Spending & Discretionary Outlays
  3. Debt Burden
  4. Savings Buffer
  5. Contractual EMIs
  6. Recurring Subscriptions
  7. Emergency Fund Runway
  8. Payment Behavior & Delinquency Risk
- **Visuals:** Color-coded pressure indicators (Low, Moderate, High), percentage indices, and deep-dive root cause cards with suggested immediate actions.

### 4. 🚨 Financial Early Warning Center
- **Page:** `#/alert-center`
- **Description:** Prioritized alert hub categorizing early warning signals (*HIGH PRIORITY*, *MEDIUM PRIORITY*, *LOW PRIORITY*).
- **Structure:** Each alert highlights:
  - *Problem Detected*
  - *Why It Matters*
  - *Suggested Action*
  - *Dismiss & View Details Actions*
- **Language:** Built with supportive, non-judgmental empathy—never scaring the user.

### 5. 📋 Personalized Recovery Plan
- **Page:** `#/recovery-plan`
- **Description:** An intelligent 4-week recovery milestone generator:
  - *Week 1:* Review unnecessary spending
  - *Week 2:* Reduce discretionary expenses
  - *Week 3:* Build emergency savings
  - *Week 4:* Review EMI commitments
- **Interactivity:** Interactive task completion checkboxes, live progress percentage bar, and monthly financial improvement counters (+₹7,200/mo, +25 Resilience pts).

### 6. 🎯 Financial Goals & Buffer Safeguards
- **Page:** `#/goals`
- **Description:** Health-linked goal creation and tracking (Emergency Fund, Buy a Laptop, Education, Travel, Debt Reduction, Home Down Payment).
- **Automated Stress Warning:** Proactively warns the user if a proposed monthly contribution creates *Excessive Financial Pressure* or threatens the 30-day emergency buffer runway.

### 7. 💳 Smart Subscription Manager
- **Page:** `#/subscriptions`
- **Description:** Automated recurring debit audit.
- **Key Insight:** *"You are spending ₹3,499 per month on recurring subscriptions."*
- **Features:** Identifies unused/inactive subscriptions (e.g. inactive >30 days), tracks potential annual savings, category breakdown bar chart, and 1-click pause/resume toggle.

### 8. 🤖 Bachat Mitra AI Financial Co-Pilot
- **Global Component:** Persistent floating drawer accessible from all pages.
- **Context-Aware Reasoning:** Ingests live account balance (₹18,500), upcoming EMI obligations (₹12,000), and discretionary burn to answer queries like:
  - *"Can I afford a ₹10,000 purchase?"* &rarr; Calculates resulting shortfall (-₹3,500) and recommends delaying or pacing the purchase to maintain runway.
- **Quick Actions:** *"Help me save money"*, *"Analyze my financial health"*, *"Why is my risk increasing?"*, *"Create a recovery plan"*, *"Help me reduce expenses"*.
- **Ethical Safeguard:** Includes prominent advisory disclaimers (not certified investment/financial advice).

### 9. ♿ Accessibility Mode
- **Controls:** Available in Header quick-toggle (`A11y`) and in `SettingsModal`.
- **Features:**
  - Larger text scaling
  - High-contrast visual mode (`contrast-125 saturate-150`)
  - Simplified dashboard layout option
  - Voice-friendly interactions (`SpeechSynthesis` web audio readout)
  - Reduced visual complexity (minimalist motion-reduced mode)

### 10. 📖 Financial Insights Summary (Monthly Financial Story)
- **Component:** `MonthlyFinancialStory.tsx` embedded on the main Dashboard.
- **Format:** High-impact narrative quote:
  > *"This month your spending increased by 12%, while your savings decreased by 8%. Your overall financial health remains at risk."*
- **3 Pillars:**
  - *What Improved*
  - *What Needs Attention*
  - *Recommended Next Steps*

### 11. 🏛️ Bank / Advisor Support View
- **Page:** `#/bank-support`
- **Audience:** Relationship managers and responsible credit advisors.
- **Ethical Banking Charter:** Strict zero-penalty policy—prohibits reporting early flags to credit bureaus or penalizing accounts.
- **Metrics:** Customers needing support (142), portfolio risk distribution, 5-month cohort stabilization trajectory, and an anonymized customer assistance queue.

### 12. 🛡️ Your Data & AI Transparency Page
- **Page:** `#/transparency`
- **Disclosures:**
  - *What financial information is analyzed*
  - *Why it is analyzed*
  - *How risk indicators are generated*
  - *What the AI DOES vs What the AI DOES NOT do*
- **Controls:** Granular privacy permission toggles, clear cache option, and a 1-click **Download My Data (JSON)** exporter.

---

## 🛠️ Technology Stack

- **Framework:** React 19, TypeScript
- **Bundler:** Vite 6
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Routing:** React Router v7 (`HashRouter`)
- **Visuals & Charts:** Recharts, Lucide React
- **Speech:** Web SpeechSynthesis API

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### 1. Installation
```bash
cd cashtwin
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
```

---

## ⚙️ Backend Integration (Optional)

CashTwin is architected to work completely standalone using deterministic financial mock intelligence across 4 customer personas:
- **CUST-001 (Arun Sharma):** Healthy baseline, high liquidity cushion.
- **CUST-002 (Priya Patel):** Watch stage, mild discretionary creep.
- **CUST-003 (Rahul Verma):** At Risk, low buffer, upcoming ₹12,000 EMI.
- **CUST-004 (Vikram Singh):** High Risk, imminent negative cash shortfall.

To connect an external Python FastAPI service:
1. Click **Settings & Accessibility** in the bottom of the sidebar.
2. Toggle **FastAPI REST Backend Mode** ON.
3. Enter your API base URL (e.g. `http://localhost:8000/api`) and click **Test Ping**.
