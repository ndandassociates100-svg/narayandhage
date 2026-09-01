/**
 * ============================================================================
 * ND & ASSOCIATES - GOOGLE APPS SCRIPT WEB APP FOR FINANCIAL HEALTH CHECKUP
 * ============================================================================
 * 
 * Deployment Instructions:
 * 1. Open Google Sheets (create a new sheet named "ND Associates Leads").
 * 2. Click Extensions > Apps Script.
 * 3. Replace all existing code in Apps Script with this entire file.
 * 4. Click "Deploy" > "New deployment" (or "Manage deployments" > "Edit" > "New version").
 * 5. Select type: "Web app".
 * 6. Set "Execute as": "Me".
 * 7. Set "Who has access": "Anyone" (Crucial: allows website submissions without login).
 * 8. Click "Deploy", copy the Web App URL.
 */

// Email to receive instant alerts when a new client submits a checkup
const NOTIFICATION_EMAIL = "narayandhage@gmail.com"; 

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: "success", message: "ND & Associates Checkup API is active." })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create and style header row if sheet is brand new
    if (sheet.getLastRow() === 0) {
      setupSheetHeaders(sheet);
    }
    
    const postData = JSON.parse(e.postData.contents);
    
    const submissionId = postData.submissionId || "ND-" + new Date().getTime();
    const timestamp = postData.formattedDate || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const fullName = postData.fullName || "";
    const dob = postData.dob || "";
    const occupation = postData.occupation || "";
    const mobile = postData.mobile || postData.mobileNumber || "";
    const whatsapp = postData.whatsapp || postData.whatsappNumber || mobile;
    const email = postData.email || postData.emailAddress || "";
    const familyMembers = postData.familyMembers || "";
    const monthlyIncome = postData.monthlyIncome || "";
    const monthlyExpenses = postData.monthlyExpenses || "";
    const existingLoans = postData.existingLoans || postData.loansEmi || "";
    const currentSavings = postData.currentSavings || "";
    const existingInvestments = postData.existingInvestments || "";
    const overallScore = postData.overallScorePercentage || "";
    const financialGoals = postData.financialGoals || "";
    const customerConcern = postData.customerConcern || "";
    const preferredTime = postData.preferredContactTime || "";
    const additionalMsg = postData.additionalMessage || "None";
    const consent = postData.consent || "Yes";
    
    // Assessment Categories (support both string status and assessment object)
    const a = postData.assessment || {};
    const incProt = postData.incomeProtection || formatCategory(a.incomeProtection);
    const emgFund = postData.emergencyFund || formatCategory(a.emergencyFund);
    const hlthIns = postData.healthInsurance || formatCategory(a.healthInsurance);
    const disIns  = postData.disabilityInsurance || formatCategory(a.disabilityInsurance);
    const chldEd  = postData.childEducation || formatCategory(a.childEducation);
    const mrgFnd  = postData.marriageFund || formatCategory(a.marriageFund);
    const retGls  = postData.retirement || formatCategory(a.retirementGoals);
    const spsCov  = postData.spouseCoverage || formatCategory(a.spouseCoverage);
    const hmLoan  = postData.homeLoanRent || formatCategory(a.homeLoanRent);
    const dbtMgmt = postData.debtManagement || formatCategory(a.debtManagement);
    const estPln  = postData.estatePlanning || formatCategory(a.estatePlanning);
    const wlthBld = postData.wealthBuilding || formatCategory(a.wealthBuilding);

    const rowData = [
      timestamp,
      submissionId,
      fullName,
      dob,
      occupation,
      mobile,
      whatsapp,
      email,
      familyMembers,
      monthlyIncome,
      monthlyExpenses,
      existingLoans,
      currentSavings,
      existingInvestments,
      overallScore,
      incProt,
      emgFund,
      hlthIns,
      disIns,
      chldEd,
      mrgFnd,
      retGls,
      spsCov,
      hmLoan,
      dbtMgmt,
      estPln,
      wlthBld,
      financialGoals,
      customerConcern,
      preferredTime,
      additionalMsg,
      consent
    ];

    sheet.appendRow(rowData);
    
    // Optional: Send Email Notification to Narayan Dhage
    if (NOTIFICATION_EMAIL && NOTIFICATION_EMAIL.indexOf("@") !== -1) {
      try {
        MailApp.sendEmail({
          to: NOTIFICATION_EMAIL,
          subject: `⚡ New Financial Health Checkup - ${fullName} (${submissionId})`,
          htmlBody: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #d4af37; padding: 20px; border-radius: 8px;">
              <h2 style="color: #07162c;">ND & ASSOCIATES</h2>
              <p style="color: #d4af37; font-weight: bold;">New Financial Health Checkup Received!</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Submission ID:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${submissionId}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${fullName}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Mobile:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="tel:${mobile}">${mobile}</a></td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>WhatsApp:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="https://wa.me/91${mobile.replace(/[^0-9]/g, '').slice(-10)}">Chat on WhatsApp</a></td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Monthly Income:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">₹ ${monthlyIncome}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Monthly Expenses:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">₹ ${monthlyExpenses}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Overall Score:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${overallScore}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Goals:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${financialGoals}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Preferred Time:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${preferredTime}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Client Concern:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${customerConcern}</td></tr>
              </table>
              <p style="margin-top: 20px; font-size: 12px; color: #777;">Submission stored automatically in your Google Sheet.</p>
            </div>
          `
        });
      } catch (mailErr) {
        // Mail quota or not configured
      }
    }

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", submissionId: submissionId })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function formatCategory(item) {
  if (!item) return "Needs Planning";
  if (typeof item === "string") return item;
  let str = item.status || "Needs Planning";
  if (item.score) str += ` (${item.score}/5)`;
  if (item.comments) str += ` - ${item.comments}`;
  return str;
}

function setupSheetHeaders(sheet) {
  const headers = [
    "Date & Time",
    "Submission ID",
    "Full Name",
    "DOB",
    "Occupation",
    "Mobile Number",
    "WhatsApp Number",
    "Email",
    "Family Members",
    "Monthly Income",
    "Monthly Expenses",
    "Existing Loans",
    "Current Savings",
    "Existing Investments",
    "Overall Score",
    "Income Protection",
    "Emergency Fund",
    "Health Insurance",
    "Disability Insurance",
    "Child Education",
    "Marriage Fund",
    "Retirement",
    "Spouse Coverage",
    "Home Loan / Rent",
    "Debt Management",
    "Estate Planning",
    "Wealth Building",
    "Financial Goals",
    "Customer Concern",
    "Preferred Time",
    "Additional Message",
    "Consent"
  ];
  
  sheet.appendRow(headers);
  
  // Format Header Row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#07162c");
  headerRange.setFontColor("#f6e27a");
  headerRange.setFontWeight("bold");
  headerRange.setFontFamily("Arial");
  sheet.setFrozenRows(1);
}
