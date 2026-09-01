/**
 * ND & ASSOCIATES - FINANCIAL HEALTH CHECKUP FORM CONTROLLER
 * Handles multi-step navigation, live score computation, client validation,
 * Google Sheets Web App submission, and WhatsApp bridge.
 */

// Production Google Apps Script Web App Endpoint
// Note: Users can deploy Code.gs in Google Sheets and paste their URL here.
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz_REPLACE_WITH_YOUR_DEPLOYED_URL/exec";

// Master State for Checkup Assessment
const checkupState = {
  currentStep: 1,
  totalSteps: 5,
  submissionId: null,
  scores: {
    income_protection: 3,
    emergency_fund: 3,
    health_insurance: 3,
    disability_insurance: 3,
    child_education: 3,
    marriage_fund: 3,
    retirement_goals: 3,
    spouse_coverage: 3,
    home_loan_rent: 3,
    debt_management: 3,
    estate_planning: 3,
    wealth_building: 3
  },
  selectedGoals: []
};

document.addEventListener('DOMContentLoaded', () => {
  initWizardNavigation();
  initScorePickers();
  initGoalCardSelects();
  initFormSubmission();
  updateLiveScoreGauge();
});

/* Initialize Wizard Navigation Buttons */
function initWizardNavigation() {
  const nextBtns = document.querySelectorAll('.wizard-next-btn');
  const prevBtns = document.querySelectorAll('.wizard-prev-btn');

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const stepToGo = parseInt(btn.getAttribute('data-next'), 10);
      if (validateCurrentStep(checkupState.currentStep)) {
        goToStep(stepToGo);
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const stepToGo = parseInt(btn.getAttribute('data-prev'), 10);
      goToStep(stepToGo);
    });
  });
}

/* Step Navigation Core */
function goToStep(stepNumber) {
  if (stepNumber < 1 || stepNumber > checkupState.totalSteps) return;

  // Update Panes
  document.querySelectorAll('.wizard-step-pane').forEach(pane => {
    pane.classList.remove('active');
  });
  const targetPane = document.getElementById(`wizardStep${stepNumber}`);
  if (targetPane) targetPane.classList.add('active');

  // Update Stepper Nodes
  document.querySelectorAll('.step-node').forEach(node => {
    const nodeStep = parseInt(node.getAttribute('data-step'), 10);
    node.classList.remove('active');
    if (nodeStep === stepNumber) {
      node.classList.add('active');
    } else if (nodeStep < stepNumber) {
      node.classList.add('completed');
    } else {
      node.classList.remove('completed');
    }
  });

  // Update Progress Fill Line
  const progressPercent = ((stepNumber - 1) / (checkupState.totalSteps - 1)) * 100;
  const progressFill = document.querySelector('.wizard-progress-fill');
  if (progressFill) {
    progressFill.style.width = `${progressPercent}%`;
  }

  checkupState.currentStep = stepNumber;

  // Smooth scroll to top of checkup container if out of view
  const checkupEl = document.getElementById('health-checkup');
  if (checkupEl) {
    const rect = checkupEl.getBoundingClientRect();
    if (rect.top < -50 || rect.top > 200) {
      checkupEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

/* Step Validation */
function validateCurrentStep(step) {
  clearStepErrors();

  if (step === 1) {
    const fullName = document.getElementById('fullName').value.trim();
    const mobile = document.getElementById('mobileNumber').value.trim();
    const email = document.getElementById('emailAddress').value.trim();

    let isValid = true;

    if (!fullName) {
      showInputError('fullName', 'Please enter your Full Name.');
      isValid = false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanMobile = mobile.replace(/[^0-9]/g, '').slice(-10);
    if (!cleanMobile || !phoneRegex.test(cleanMobile)) {
      showInputError('mobileNumber', 'Please enter a valid 10-digit Indian mobile number.');
      isValid = false;
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showInputError('emailAddress', 'Please enter a valid email address.');
        isValid = false;
      }
    }

    return isValid;
  }

  if (step === 5) {
    const consent = document.getElementById('consentAgreement');
    if (consent && !consent.checked) {
      alert('Please check the consent agreement to proceed with your Financial Health Checkup submission.');
      return false;
    }
  }

  return true;
}

function showInputError(inputId, message) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.style.borderColor = '#ef4444';
  
  let err = input.parentElement.querySelector('.form-error-text');
  if (!err) {
    err = document.createElement('span');
    err.className = 'form-error-text';
    err.style.color = '#ef4444';
    err.style.fontSize = '0.78rem';
    err.style.marginTop = '0.25rem';
    input.parentElement.appendChild(err);
  }
  err.textContent = message;
  input.focus();
}

function clearStepErrors() {
  document.querySelectorAll('.form-error-text').forEach(el => el.remove());
  document.querySelectorAll('.checkup-input').forEach(inp => {
    inp.style.borderColor = '';
  });
}

/* 12-Assessment Score Buttons Interaction */
function initScorePickers() {
  const scoreButtons = document.querySelectorAll('.score-btn');

  scoreButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      const score = parseInt(btn.getAttribute('data-score'), 10);

      // Deselect siblings in same group
      const parent = btn.closest('.assessment-score-picker');
      parent.querySelectorAll('.score-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      // Update state
      checkupState.scores[category] = score;
      updateLiveScoreGauge();
    });
  });
}

/* Calculate Total Financial Health Fitness Score (0 to 100%) */
function updateLiveScoreGauge() {
  const scoreValues = Object.values(checkupState.scores);
  const totalObtained = scoreValues.reduce((acc, curr) => acc + curr, 0);
  const maxPossible = scoreValues.length * 5; // 12 * 5 = 60
  const percentage = Math.round((totalObtained / maxPossible) * 100);

  const gaugeDigits = document.getElementById('liveScoreDigits');
  const gaugeFill = document.getElementById('liveScoreProgress');
  const gaugeStatus = document.getElementById('liveScoreStatus');

  if (gaugeDigits) gaugeDigits.textContent = `${percentage}%`;
  if (gaugeFill) gaugeFill.style.width = `${percentage}%`;

  if (gaugeStatus) {
    if (percentage >= 80) {
      gaugeStatus.textContent = "Excellent Financial Foundation";
      if (gaugeFill) gaugeFill.style.background = "linear-gradient(135deg, #10b981 0%, #34d399 100%)";
    } else if (percentage >= 60) {
      gaugeStatus.textContent = "Good Fitness - Key Protection Needed";
      if (gaugeFill) gaugeFill.style.background = "linear-gradient(135deg, #d4af37 0%, #f6e27a 100%)";
    } else if (percentage >= 40) {
      gaugeStatus.textContent = "Moderate - Risk Gaps Identified";
      if (gaugeFill) gaugeFill.style.background = "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)";
    } else {
      gaugeStatus.textContent = "Needs Urgent Financial Attention";
      if (gaugeFill) gaugeFill.style.background = "linear-gradient(135deg, #ef4444 0%, #f87171 100%)";
    }
  }
}

/* Step 4: Multi-Select Goal Cards */
function initGoalCardSelects() {
  const goalCards = document.querySelectorAll('.goal-card-select');

  goalCards.forEach(card => {
    card.addEventListener('click', () => {
      const checkbox = card.querySelector('.goal-checkbox');
      const goalValue = card.getAttribute('data-goal');

      card.classList.toggle('selected');
      if (checkbox) checkbox.checked = !checkbox.checked;

      if (card.classList.contains('selected')) {
        if (!checkupState.selectedGoals.includes(goalValue)) {
          checkupState.selectedGoals.push(goalValue);
        }
      } else {
        checkupState.selectedGoals = checkupState.selectedGoals.filter(g => g !== goalValue);
      }
    });
  });
}

/* Generate Unique Human-Readable Reference ID */
function generateSubmissionId() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `ND-${year}-${randomNum}`;
}

/* Step 5: Form Submission & Google Sheets Integration */
function initFormSubmission() {
  const form = document.getElementById('financialHealthCheckupForm');
  const submitBtn = document.getElementById('submitCheckupBtn');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateCurrentStep(5)) return;

    // Show Loading State
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg style="animation: spin 1s linear infinite; width:18px; height:18px; margin-right:8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
      Submitting Your Checkup...
    `;

    // Generate Submission ID
    const submissionId = generateSubmissionId();
    checkupState.submissionId = submissionId;

    // Gather Complete Assessment Payload
    const payload = {
      submissionId: submissionId,
      timestamp: new Date().toISOString(),
      formattedDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      
      // Step 1: Personal
      fullName: document.getElementById('fullName').value.trim(),
      dob: document.getElementById('dob').value.trim() || 'N/A',
      occupation: document.getElementById('occupation').value.trim() || 'N/A',
      mobileNumber: document.getElementById('mobileNumber').value.trim(),
      whatsappNumber: document.getElementById('whatsappNumber').value.trim() || document.getElementById('mobileNumber').value.trim(),
      emailAddress: document.getElementById('emailAddress').value.trim() || 'N/A',
      familyMembers: document.getElementById('familyMembers').value || '1',

      // Step 2: Financial Info
      monthlyIncome: document.getElementById('monthlyIncome').value.trim() || 'N/A',
      monthlyExpenses: document.getElementById('monthlyExpenses').value.trim() || 'N/A',
      loansEmi: document.getElementById('loansEmi').value.trim() || 'N/A',
      currentSavings: document.getElementById('currentSavings').value.trim() || 'N/A',
      existingInvestments: document.getElementById('existingInvestments').value.trim() || 'N/A',

      // Step 3: 12 Assessment Categories (Status, Score, Comments)
      assessment: {
        incomeProtection: {
          status: document.getElementById('status_income_protection')?.value.trim() || 'N/A',
          score: checkupState.scores.income_protection,
          comments: document.getElementById('comm_income_protection')?.value.trim() || ''
        },
        emergencyFund: {
          status: document.getElementById('status_emergency_fund')?.value.trim() || 'N/A',
          score: checkupState.scores.emergency_fund,
          comments: document.getElementById('comm_emergency_fund')?.value.trim() || ''
        },
        healthInsurance: {
          status: document.getElementById('status_health_insurance')?.value.trim() || 'N/A',
          score: checkupState.scores.health_insurance,
          comments: document.getElementById('comm_health_insurance')?.value.trim() || ''
        },
        disabilityInsurance: {
          status: document.getElementById('status_disability_insurance')?.value.trim() || 'N/A',
          score: checkupState.scores.disability_insurance,
          comments: document.getElementById('comm_disability_insurance')?.value.trim() || ''
        },
        childEducation: {
          status: document.getElementById('status_child_education')?.value.trim() || 'N/A',
          score: checkupState.scores.child_education,
          comments: document.getElementById('comm_child_education')?.value.trim() || ''
        },
        marriageFund: {
          status: document.getElementById('status_marriage_fund')?.value.trim() || 'N/A',
          score: checkupState.scores.marriage_fund,
          comments: document.getElementById('comm_marriage_fund')?.value.trim() || ''
        },
        retirementGoals: {
          status: document.getElementById('status_retirement_goals')?.value.trim() || 'N/A',
          score: checkupState.scores.retirement_goals,
          comments: document.getElementById('comm_retirement_goals')?.value.trim() || ''
        },
        spouseCoverage: {
          status: document.getElementById('status_spouse_coverage')?.value.trim() || 'N/A',
          score: checkupState.scores.spouse_coverage,
          comments: document.getElementById('comm_spouse_coverage')?.value.trim() || ''
        },
        homeLoanRent: {
          status: document.getElementById('status_home_loan_rent')?.value.trim() || 'N/A',
          score: checkupState.scores.home_loan_rent,
          comments: document.getElementById('comm_home_loan_rent')?.value.trim() || ''
        },
        debtManagement: {
          status: document.getElementById('status_debt_management')?.value.trim() || 'N/A',
          score: checkupState.scores.debt_management,
          comments: document.getElementById('comm_debt_management')?.value.trim() || ''
        },
        estatePlanning: {
          status: document.getElementById('status_estate_planning')?.value.trim() || 'N/A',
          score: checkupState.scores.estate_planning,
          comments: document.getElementById('comm_estate_planning')?.value.trim() || ''
        },
        wealthBuilding: {
          status: document.getElementById('status_wealth_building')?.value.trim() || 'N/A',
          score: checkupState.scores.wealth_building,
          comments: document.getElementById('comm_wealth_building')?.value.trim() || ''
        }
      },

      // Step 4: Goals
      financialGoals: checkupState.selectedGoals.length ? checkupState.selectedGoals.join(', ') : 'Comprehensive Financial Planning',

      // Step 5: Preferences & Consent
      customerConcern: document.getElementById('customerConcern').value.trim() || 'General Portfolio Review',
      preferredContactTime: document.getElementById('preferredContactTime').value || 'Anytime',
      additionalMessage: document.getElementById('additionalMessage').value.trim() || 'None',
      consentAgreed: true,
      overallScorePercentage: document.getElementById('liveScoreDigits')?.textContent || '50%'
    };

    // Save locally as reliable fallback
    try {
      const existingSubmissions = JSON.parse(localStorage.getItem('nd_checkups') || '[]');
      existingSubmissions.unshift(payload);
      localStorage.setItem('nd_checkups', JSON.stringify(existingSubmissions.slice(0, 50)));
    } catch (err) {
      console.warn('LocalStorage save skipped:', err);
    }

    // Submit to Google Apps Script Web App Endpoint if configured
    if (GOOGLE_APPS_SCRIPT_URL && !GOOGLE_APPS_SCRIPT_URL.includes('REPLACE_WITH_YOUR_DEPLOYED_URL')) {
      try {
        await fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors', // Standard for Google Apps Script Web Apps
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (postErr) {
        console.warn('Google Sheets transmission logged:', postErr);
      }
    }

    // Reset Submit Button & Open Success Modal
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnContent;

    showSuccessModal(payload);
  });
}

/* Success Modal Controller */
function showSuccessModal(data) {
  const modal = document.getElementById('successModal');
  const idDisplay = document.getElementById('modalSubmissionId');
  const waBtn = document.getElementById('modalWhatsAppBtn');

  if (idDisplay) idDisplay.textContent = data.submissionId;

  // Pre-fill WhatsApp message to Narayan Dhage (+91 98505 53571)
  if (waBtn) {
    const waText = encodeURIComponent(
      `*Hello Narayan Sir,*\n\nI have just submitted my *Financial Health Check up* on your website.\n\n*Submission ID:* ${data.submissionId}\n*Name:* ${data.fullName}\n*Mobile:* ${data.mobileNumber}\n*Overall Fitness Score:* ${data.overallScorePercentage}\n*Goals:* ${data.financialGoals}\n\nPlease review my financial assessment when convenient.`
    );
    waBtn.href = `https://wa.me/919850553571?text=${waText}`;
  }

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/* Close Modal Handler */
function closeSuccessModal() {
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Reset form to step 1
  const form = document.getElementById('financialHealthCheckupForm');
  if (form) form.reset();
  goToStep(1);
}
