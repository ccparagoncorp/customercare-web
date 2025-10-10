# Google Sheets Integration Setup

## Overview
This setup allows feedback data from both the contact form and feedback widget to be automatically saved to Google Sheets for easy reporting and analysis.

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

## Step 2: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `feedback-sheets-service`
   - Description: `Service account for feedback Google Sheets integration`
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

## Step 3: Generate Service Account Key

1. Find your newly created service account in the credentials list
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" > "Create new key"
5. Choose "JSON" format
6. Download the JSON file (keep it secure!)

## Step 4: Create Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it "Customer Care Feedback" (or any name you prefer)
4. Copy the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```

## Step 5: Share Spreadsheet with Service Account

1. In your Google Spreadsheet, click "Share"
2. Add the service account email (from step 2) as an editor
3. The email format will be: `feedback-sheets-service@your-project-id.iam.gserviceaccount.com`

## Step 6: Configure Environment Variables

Add these variables to your `.env.local` file:

```env
# Google Sheets Configuration
GOOGLE_SHEET_ID=your-spreadsheet-id-from-step-4
GOOGLE_SHEET_NAME=Feedback
GOOGLE_SERVICE_ACCOUNT_EMAIL=feedback-sheets-service@your-project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-From-JSON-File\n-----END PRIVATE KEY-----\n"
```

**Important:** 
- Replace `your-spreadsheet-id-from-step-4` with the actual spreadsheet ID
- Replace `your-project-id` with your actual Google Cloud project ID
- Copy the private key from the JSON file you downloaded, keeping the `\n` characters

## Step 7: Test the Integration

1. Start your development server: `npm run dev`
2. Submit a feedback through the contact form
3. Submit a feedback through the feedback widget
4. Check your Google Spreadsheet - you should see new rows with the feedback data

## Data Structure

The spreadsheet will have these columns:
- **Timestamp**: When the feedback was submitted
- **Name**: User's name
- **Email**: User's email address
- **Subject**: Feedback subject
- **Message**: Feedback message
- **Source**: Either "contact-form" or "feedback-widget"
- **Rating**: Star rating (only for feedback widget)

## Troubleshooting

### Common Issues:

1. **"The caller does not have permission"**
   - Make sure the service account email is shared with the spreadsheet
   - Check that the service account has Editor access

2. **"Invalid credentials"**
   - Verify the private key is correctly formatted with `\n` characters
   - Ensure the service account email matches the JSON file

3. **"Spreadsheet not found"**
   - Double-check the GOOGLE_SHEET_ID
   - Make sure the spreadsheet exists and is accessible

4. **"Sheet not found"**
   - The sheet name should match exactly (case-sensitive)
   - Default is "Feedback" but you can change it via GOOGLE_SHEET_NAME

## Security Notes

- Keep your service account JSON file secure
- Never commit the `.env.local` file to version control
- Consider using environment-specific service accounts for production
- Regularly rotate service account keys in production environments
