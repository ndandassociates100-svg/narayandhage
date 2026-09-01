# ND & ASSOCIATES — Official Financial Advisory Website

> **"Your Trusted Financial Advisor" • "Protect Today. Secure Tomorrow."**

Official website for **ND & ASSOCIATES**, led by **Narayan Dhage**, Insurance & Investment Consultant based in Chandrapur, Maharashtra, India.

---

## 🌟 Practice Overview

- **Consultant**: Narayan Dhage (Insurance & Investment Consultant)
- **Experience**: 20+ Years of dedicated financial advisory practice
- **Families Protected**: 1500+ Families served across Chandrapur and Maharashtra
- **Portfolio Managed**: ₹200 Crore+ Sum Assured under active risk management
- **Website**: [www.narayandhage.in](https://www.narayandhage.in)
- **Contact**: +91 98505 53571
- **Location**: Chandrapur, Maharashtra, India

---

## 🛡️ Core Advisory Services

1. **Life Insurance**: Pure term protection, income replacement (20× Income Rule), MWPA ring-fencing.
2. **Health Insurance**: Comprehensive family floaters, critical illness covers, super top-up protection.
3. **Child Education Planning**: Inflation-adjusted milestone funding for higher education and career security.
4. **Retirement Planning**: 300× monthly expense corpus sizing, guaranteed pension/annuity cash flows.
5. **Investments & SIP**: Disciplined long-term compounding, asset allocation, and wealth creation.

---

## 📋 Flagship Financial Health Checkup Tool

A 5-step interactive campaign assessment tool:
- **Step 1**: Personal Details & Contact Info
- **Step 2**: Financial Overview (Income, Expenses, EMIs, Savings)
- **Step 3**: 12-Point Financial Fitness Assessment Matrix (with real-time fitness score gauge 0-100%)
- **Step 4**: Multi-Select Financial Goals Selection
- **Step 5**: Specific Concerns, Preferred Contact Time & Statutory Consent

### 📊 Google Sheets Web App Integration
- Zero frontend credential exposure.
- Direct row appending with timestamp, formatted values, scores, and unique reference ID (`ND-2026-XXXXX`).
- Automatic email notification alert to consultant.
- Instant WhatsApp bridge with pre-filled submission summary.

---

## 📂 Repository Structure

```
narayandhage/
├── index.html                   # Semantic master web page with Schema.org JSON-LD
├── css/
│   ├── style.css                # Master design system (Deep Navy & Champagne Gold)
│   ├── checkup.css              # 5-Step Checkup Wizard, 12-card scoring, gauge & modal
│   └── responsive.css           # Mobile drawer, floating action bar & tablet rules
├── js/
│   ├── app.js                   # Header, mobile drawer, counter animations & smooth scroll
│   ├── checkup-form.js          # Wizard logic, validation, Google Sheets API & WhatsApp
│   └── calculators.js           # 4 Interactive Indian financial rule-of-thumb calculators
├── assets/
│   └── images/                  # Portrait headshots, logo graphics & campaign references
├── google-apps-script/
│   ├── Code.gs                  # Production Google Apps Script webhook
│   └── README.md                # 3-minute setup guide for Google Sheets
├── sitemap.xml                  # Search engine index map
├── robots.txt                   # Web crawler directives
└── README.md                    # Repository documentation
```

---

## 🚀 How to Run Locally

1. Clone or download the repository:
   ```bash
   git clone https://github.com/shamshadkhan36/narayandhange.git
   cd narayandhange
   ```
2. Open `index.html` directly in any web browser, or serve with:
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx serve
   ```

---

## ⚖️ Statutory Disclaimer
*Financial products and services are subject to applicable terms, conditions and regulations. Please evaluate your financial needs and risk profile before making financial decisions. ND & Associates and Narayan Dhage do not guarantee specific investment returns.*
