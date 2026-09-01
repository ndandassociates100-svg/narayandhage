# Google Sheets Integration Guide for ND & Associates

Connect the **Financial Health Checkup Form** to your private Google Sheet in 3 minutes.

---

## 🚀 3-Step Setup Instructions

### Step 1: Create a Google Sheet
1. Go to [Google Sheets](https://sheets.new) and create a new spreadsheet.
2. Name the sheet **`ND Associates Financial Health Leads`**.

### Step 2: Paste the Script
1. In your Google Sheet, click **Extensions** > **Apps Script**.
2. Delete any default code in the editor (`function myFunction() {...}`).
3. Open the file [`google-apps-script/Code.gs`](Code.gs) in this project, copy its entire contents, and paste it into the Google Apps Script editor.
4. *(Optional)* Update `const NOTIFICATION_EMAIL = "narayandhage@gmail.com";` with your email to receive instant email notifications for every submission.
5. Click the **Save** icon (disk icon).

### Step 3: Deploy as Web App
1. Click the blue **Deploy** button (top right) > select **New deployment**.
2. In the modal, click the gear icon ⚙️ next to "Select type" and choose **Web app**.
3. Configure the deployment settings:
   - **Description**: `ND Checkup Form Endpoint`
   - **Execute as**: `Me (your Google email)`
   - **Who has access**: `Anyone` *(Crucial: allows website submissions to write without requiring Google login)*
4. Click **Deploy**.
5. Grant permissions if prompted (Click *Advanced* > *Go to Untitled project (unsafe)* > *Allow*).
6. Copy the **Web App URL** (looks like `https://script.google.com/macros/s/AKfycb.../exec`).

### Step 4: Link to Website
1. Open [`js/checkup-form.js`](../js/checkup-form.js) in your website codebase.
2. On line 8, replace the placeholder URL:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = "PASTE_YOUR_COPIED_WEB_APP_URL_HERE";
   ```
3. Save the file. That's it!

---

## 🔒 Security & Privacy Guarantee

- **Zero API Keys in Frontend**: Client-side code never exposes your Google account credentials or sheet passwords.
- **Direct Row Appending**: Submissions automatically append to the sheet without granting visitors read access to other leads.
- **Backup Redundancy**: Even if offline or during network interruptions, submissions are safely backed up in `localStorage` and client can click "Talk on WhatsApp" with pre-filled submission data.
