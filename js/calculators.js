/**
 * ND & ASSOCIATES - Interactive Financial Calculators
 * Implements 4 key Indian financial advisory rule-of-thumb calculators
 */

document.addEventListener('DOMContentLoaded', () => {
  initCalculatorTabs();
  initHLVCalculator();
  initRetirementCalculator();
  initEmergencyCalculator();
  initSIPCalculator();
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

    // 300x Monthly Expense Rule from Narayan Dhage's campaign matrix
    const recommendedCorpus = expense * 300;
    const yearsToRetire = Math.max(1, 60 - age);

    if (resultAmount) resultAmount.textContent = formatINR(recommendedCorpus);
    if (monthlyExpenseResult) monthlyExpenseResult.textContent = formatINR(expense * 12) + ' / yr';
    if (ruleMultiplier) ruleMultiplier.textContent = `${yearsToRetire} Yrs to 60 (300× Rule)`;
  }

  expenseSlider.addEventListener('input', calculate);
  currentAgeSlider.addEventListener('input', calculate);
  calculate();
}

/* 3. Emergency Liquid Fund - 3-6x Expense Rule */
function initEmergencyCalculator() {
  const expSlider = document.getElementById('emgExpSlider');
  const expVal = document.getElementById('emgExpVal');
  const emiSlider = document.getElementById('emgEmiSlider');
  const emiVal = document.getElementById('emgEmiVal');
  const monthsSlider = document.getElementById('emgMonthsSlider');
  const monthsVal = document.getElementById('emgMonthsVal');

  const resultAmount = document.getElementById('emgResultAmount');
  const minTarget = document.getElementById('emgMinTarget');
  const idealTarget = document.getElementById('emgIdealTarget');

  if (!expSlider) return;

  function calculate() {
    const exp = parseInt(expSlider.value, 10);
    const emi = parseInt(emiSlider.value, 10);
    const months = parseInt(monthsSlider.value, 10);

    expVal.textContent = '₹ ' + exp.toLocaleString('en-IN');
    emiVal.textContent = '₹ ' + emi.toLocaleString('en-IN');
    monthsVal.textContent = months + ' Months';

    const monthlyTotal = exp + emi;
    const totalRequired = monthlyTotal * months;

    if (resultAmount) resultAmount.textContent = formatINR(totalRequired);
    if (minTarget) minTarget.textContent = formatINR(monthlyTotal * 3);
    if (idealTarget) idealTarget.textContent = formatINR(monthlyTotal * 6);
  }

  expSlider.addEventListener('input', calculate);
  emiSlider.addEventListener('input', calculate);
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
