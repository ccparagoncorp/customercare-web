import { google } from 'googleapis';

// Google Sheets configuration
let SHEET_ID = process.env.GOOGLE_SHEET_ID;
// Extract ID from URL if full URL is provided
if (SHEET_ID?.includes('docs.google.com/spreadsheets/d/')) {
  const match = SHEET_ID.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match) {
    SHEET_ID = match[1];
  }
}

const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || 'Feedback';
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

export interface FeedbackData {
  name: string;
  email: string;
  title?: string; // khusus form lengkap (contact form)
  rating?: number; // khusus popup (feedback widget)
  feedback: string; // message content
  source: 'contact-form' | 'feedback-widget';
  timestamp: string;
}

export async function saveToGoogleSheets(data: FeedbackData): Promise<void> {
  if (!SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    console.log('Google Sheets not configured, skipping...');
    return;
  }

  try {
    // Authenticate with Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Prepare the data row sesuai struktur baru
    const values = [
      [
        data.timestamp,
        data.email,
        data.name,
        data.title || '', // kosong untuk feedback widget
        data.rating || '', // kosong untuk contact form
        data.feedback,
        data.source,
      ],
    ];

    // Append data to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:G`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    console.log('Data successfully saved to Google Sheets');
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    // Don't throw error to avoid breaking the main flow
    // The feedback should still be sent via email even if Sheets fails
  }
}

export async function initializeGoogleSheet(): Promise<void> {
  if (!SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    console.log('Google Sheets not configured, skipping initialization...');
    return;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Check if headers exist, if not create them
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A1:G1`,
    });

    const existingHeaders = response.data.values?.[0];
    
    if (!existingHeaders || existingHeaders.length === 0) {
      // Create headers sesuai struktur baru
      const headers = [
        'timestamp',
        'email',
        'name',
        'title',
        'rating',
        'feedback',
        'source'
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_NAME}!A1:G1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [headers],
        },
      });

      console.log('Google Sheets headers initialized');
    }
  } catch (error) {
    console.error('Error initializing Google Sheet:', error);
  }
}
