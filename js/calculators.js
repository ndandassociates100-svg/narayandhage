/**
 * ND & ASSOCIATES - Interactive Financial Calculators
 * Implements 5 key Indian financial advisory rule-of-thumb & loan calculators
 */

document.addEventListener('DOMContentLoaded', () => {
  initCalculatorTabs();
  initHLVCalculator();
  initRetirementCalculator();
  initEmergencyCalculator();
  initSIPCalculator();
  initHomeLoanCalculator();
});

/* Tab Switching Logic */
function initCalculatorTabs() {
  const tabBtns = document.querySelectorAll('.calc-tab-btn');
  const panels = document.querySelectorAll('.calc-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

/* Helper to format INR Currency */
function formatINR(val) {
  if (val >= 10000000) {
    return '₹ ' + (val / 10000000).toFixed(2) + ' Cr';
  } else if (val >= 100000) {
    return '₹ ' + (val / 100000).toFixed(2) + ' Lakh';
  } else {
    return '₹ ' + Math.round(val).toLocaleString('en-IN');
  }
}

/* 1. Human Life Value (HLV) - 20x Income Rule Calculator */
function initHLVCalculator() {
  const incomeSlider = document.getElementById('hlvIncomeSlider');
  const incomeVal = document.getElementById('hlvIncomeVal');
  const depSlider = document.getElementById('hlvDepSlider');
  const depVal = document.getElementById('hlvDepVal');
  const existingSlider = document.getElementById('hlvExistingSlider');
  const existingVal = document.getElementById('hlvExistingVal');

  const resultAmount = document.getElementById('hlvResultAmount');
  const baselineCover = document.getElementById('hlvBaselineCover');
  const gapCover = document.getElementById('hlvGapCover');

  if (!incomeSlider) return;

  function calculate() {
    const income = parseInt(incomeSlider.value, 10);
    const deps = parseInt(depSlider.value, 10);
    const existing = parseInt(existingSlider.value, 10);

    incomeVal.textContent = '₹ ' + (income / 100000).toFixed(1) + ' Lakh / yr';
    depVal.textContent = deps + (deps === 1 ? ' Person' : ' Persons');
    existingVal.textContent = existing === 0 ? '₹ 0' : formatINR(existing);

    // Narayan Dhage's 20x Annual Income Rule + Additional buffer for dependents
    const grossNeed = (income * 20) + (deps * 500000);
    const netGap = Math.max(0, grossNeed - existing);

    if (resultAmount) resultAmount.textContent = formatINR(grossNeed);
    if (baselineCover) baselineCover.textContent = formatINR(income * 20);
    if (gapCover) gapCover.textContent = formatINR(netGap);
  }

  incomeSlider.addEventListener('input', calculate);
  depSlider.addEventListener('input', calculate);
  existingSlider.addEventListener('input', calculate);
  calculate();
}

/* 2. Retirement Corpus - 300x Monthly Expense Rule */
function initRetirementCalculator() {
  const expenseSlider = document.getElementById('retExpenseSlider');
  const expenseVal = document.getElementById('retExpenseVal');
  const currentAgeSlider = document.getElementById('retAgeSlider');
  const currentAgeVal = document.getElementById('retAgeVal');

  const resultAmount = document.getElementById('retResultAmount');
  const monthlyExpenseResult = document.getElementById('retMonthlyResult');
  const ruleMultiplier = document.getElementById('retRuleMultiplier');

  if (!expenseSlider) return;

  function calculate() {
    const expense = parseInt(expenseSlider.value, 10);
    const age = parseInt(currentAgeSlider.value, 10);

    expenseVal.textContent = '₹ ' + expense.toLocaleString('en-IN') + ' / mo';
    currentAgeVal.textContent = age + ' Years';

    // 300x Monthly Expenses Rule (or 25x Annual Expenses Rule)
    const corpusTarget = expense * 300;

    if (resultAmount) resultAmount.textContent = formatINR(corpusTarget);
    if (monthlyExpenseResult) monthlyExpenseResult.textContent = '₹ ' + expense.toLocaleString('en-IN');
    if (ruleMultiplier) ruleMultiplier.textContent = formatINR(corpusTarget);
  }

  expenseSlider.addEventListener('input', calculate);
  currentAgeSlider.addEventListener('input', calculate);
  calculate();
}

/* 3. Emergency Reserve Fund (3-6x Monthly Expenses Rule) */
function initEmergencyCalculator() {
  const expenseSlider = document.getElementById('emgExpenseSlider');
  const expenseVal = document.getElementById('emgExpenseVal');
  const monthsSlider = document.getElementById('emgMonthsSlider');
  const monthsVal = document.getElementById('emgMonthsVal');

  const resultAmount = document.getElementById('emgResultAmount');
  const monthlyDisplay = document.getElementById('emgMonthlyDisplay');
  const durationDisplay = document.getElementById('emgDurationDisplay');

  if (!expenseSlider) return;

  function calculate() {
    const expense = parseInt(expenseSlider.value, 10);
    const months = parseInt(monthsSlider.value, 10);

    expenseVal.textContent = '₹ ' + expense.toLocaleString('en-IN') + ' / mo';
    monthsVal.textContent = months + ' Months Buffer';

    const emergencyFundNeed = expense * months;

    if (resultAmount) resultAmount.textContent = formatINR(emergencyFundNeed);
    if (monthlyDisplay) monthlyDisplay.textContent = '₹ ' + expense.toLocaleString('en-IN');
    if (durationDisplay) durationDisplay.textContent = months + ' Months';
  }

  expenseSlider.addEventListener('input', calculate);
  monthsSlider.addEventListener('input', calculate);
  calculate();
}

/* 4. SIP Wealth Creator Calculator */
function initSIPCalculator() {
  const sipAmountSlider = document.getElementById('sipAmountSlider');
  const sipAmountVal = document.getElementById('sipAmountVal');
  const sipRateSlider = document.getElementById('sipRateSlider');
  const sipRateVal = document.getElementById('sipRateVal');
  const sipTenureSlider = document.getElementById('sipTenureSlider');
  const sipTenureVal = document.getElementById('sipTenureVal');

  const resultAmount = document.getElementById('sipResultAmount');
  const investedAmountEl = document.getElementById('sipInvestedAmount');
  const returnsAmountEl = document.getElementById('sipReturnsAmount');

  if (!sipAmountSlider) return;

  function calculate() {
    const P = parseInt(sipAmountSlider.value, 10);
    const annualRate = parseFloat(sipRateSlider.value);
    const years = parseInt(sipTenureSlider.value, 10);

    sipAmountVal.textContent = '₹ ' + P.toLocaleString('en-IN') + ' / mo';
    sipRateVal.textContent = annualRate + ' % p.a.';
    sipTenureVal.textContent = years + (years === 1 ? ' Year' : ' Years');

    const i = (annualRate / 100) / 12;
    const n = years * 12;

    // SIP Future Value formula: P * [( (1 + i)^n - 1 ) / i] * (1 + i)
    const futureValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const totalInvested = P * n;
    const wealthGain = Math.max(0, futureValue - totalInvested);

    if (resultAmount) resultAmount.textContent = formatINR(futureValue);
    if (investedAmountEl) investedAmountEl.textContent = formatINR(totalInvested);
    if (returnsAmountEl) returnsAmountEl.textContent = formatINR(wealthGain);
  }

  sipAmountSlider.addEventListener('input', calculate);
  sipRateSlider.addEventListener('input', calculate);
  sipTenureSlider.addEventListener('input', calculate);
  calculate();
}

/* 5. Home Loan EMI Calculator (LIC HFL & Indian Mortgage Standards) */
function initHomeLoanCalculator() {
  const amountSlider = document.getElementById('homeLoanAmountSlider');
  const amountVal = document.getElementById('homeLoanAmountVal');
  const rateSlider = document.getElementById('homeLoanRateSlider');
  const rateVal = document.getElementById('homeLoanRateVal');
  const tenureSlider = document.getElementById('homeLoanTenureSlider');
  const tenureVal = document.getElementById('homeLoanTenureVal');

  const resultEmi = document.getElementById('homeLoanResultEmi');
  const principalAmountEl = document.getElementById('homeLoanPrincipalAmount');
  const totalInterestEl = document.getElementById('homeLoanTotalInterest');
  const totalPayableEl = document.getElementById('homeLoanTotalPayable');

  if (!amountSlider) return;

  function calculate() {
    const P = parseInt(amountSlider.value, 10);
    const annualRate = parseFloat(rateSlider.value);
    const years = parseInt(tenureSlider.value, 10);

    amountVal.textContent = formatINR(P);
    rateVal.textContent = annualRate.toFixed(1) + ' % p.a.';
    tenureVal.textContent = years + (years === 1 ? ' Year' : ' Years');

    const r = (annualRate / 100) / 12;
    const n = years * 12;

    // Standard EMI formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = Math.max(0, totalPayment - P);

    if (resultEmi) resultEmi.textContent = '₹ ' + Math.round(emi).toLocaleString('en-IN') + ' / mo';
    if (principalAmountEl) principalAmountEl.textContent = formatINR(P);
    if (totalInterestEl) totalInterestEl.textContent = formatINR(totalInterest);
    if (totalPayableEl) totalPayableEl.textContent = formatINR(totalPayment);
  }

  amountSlider.addEventListener('input', calculate);
  rateSlider.addEventListener('input', calculate);
  tenureSlider.addEventListener('input', calculate);
  calculate();
}
