import { google } from 'googleapis';

// Helper function to extract sheet ID from URL
function extractSheetId(sheetId: string | undefined): string | undefined {
  if (!sheetId) return undefined;
  if (sheetId.includes('docs.google.com/spreadsheets/d/')) {
    const match = sheetId.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      return match[1];
    }
  }
  return sheetId;
}

// Helper function to get Google Sheets config based on source
function getGoogleSheetsConfig(source: 'contact-form' | 'feedback-widget' | 'improvement-form') {
  if (source === 'improvement-form') {
    // Use _AGENT suffix for improvement form
    return {
      sheetId: extractSheetId(process.env.GOOGLE_SHEET_ID_AGENT),
      sheetName: process.env.GOOGLE_SHEET_NAME_AGENT || 'Feedback',
      serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL_AGENT,
      privateKey: process.env.GOOGLE_PRIVATE_KEY_AGENT?.replace(/\\n/g, '\n'),
    };
  } else {
    // Use default config for contact-form and feedback-widget
    return {
      sheetId: extractSheetId(process.env.GOOGLE_SHEET_ID),
      sheetName: process.env.GOOGLE_SHEET_NAME || 'Feedback',
      serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };
  }
}

export interface FeedbackData {
  name: string;
  email: string;
  title?: string; // khusus form lengkap (contact form) atau role (improvement form)
  rating?: number; // khusus popup (feedback widget)
  feedback: string; // message content
  source: 'contact-form' | 'feedback-widget' | 'improvement-form';
  timestamp: string;
}

export async function saveToGoogleSheets(data: FeedbackData): Promise<void> {
  const config = getGoogleSheetsConfig(data.source);
  
  if (!config.sheetId || !config.serviceAccountEmail || !config.privateKey) {
    console.log(`Google Sheets not configured for ${data.source}, skipping...`);
    return;
  }

  try {
    // Authenticate with Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: config.serviceAccountEmail,
        private_key: config.privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Prepare the data row sesuai struktur spreadsheet
    // Untuk improvement-form: Timestamp, Email, Name, Role, Message, Form (6 kolom)
    // Untuk form lain: Timestamp, Email, Name, Title, Rating, Feedback, Source (7 kolom)
    let values: (string | number)[][];
    
    if (data.source === 'improvement-form') {
      // Improvement form: 6 kolom (Timestamp, Email, Name, Role, Message, Form)
      values = [
        [
          data.timestamp,
          data.email,
          data.name,
          data.title || '', // role untuk improvement form
          data.feedback,
          data.source,
        ],
      ];
    } else {
      // Contact form & feedback widget: 7 kolom
      values = [
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
    }

    // Check if row 2 is empty, if so write to row 2, otherwise append
    const rangeCheck = data.source === 'improvement-form' ? 'A2:F2' : 'A2:G2';
    const checkResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: config.sheetId,
      range: `${config.sheetName}!${rangeCheck}`,
    });

    const row2Data = checkResponse.data.values?.[0];
    
    if (!row2Data || row2Data.length === 0 || row2Data.every(cell => !cell || cell.toString().trim() === '')) {
      // Row 2 is empty, write to row 2
      const rangeUpdate = data.source === 'improvement-form' ? 'A2:F2' : 'A2:G2';
      await sheets.spreadsheets.values.update({
        spreadsheetId: config.sheetId,
        range: `${config.sheetName}!${rangeUpdate}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });
      console.log(`Data successfully saved to Google Sheets row 2 (${data.source})`);
    } else {
      // Row 2 has data, append to the end
      const rangeAppend = data.source === 'improvement-form' ? 'A:F' : 'A:G';
      await sheets.spreadsheets.values.append({
        spreadsheetId: config.sheetId,
        range: `${config.sheetName}!${rangeAppend}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });
      console.log(`Data successfully saved to Google Sheets (${data.source})`);
    }
  } catch (error) {
    console.error(`Error saving to Google Sheets (${data.source}):`, error);
    // Don't throw error to avoid breaking the main flow
    // The feedback should still be sent via email even if Sheets fails
  }
}

export async function initializeGoogleSheet(): Promise<void> {
  // Initialize both sheets (default and agent)
  const defaultConfig = getGoogleSheetsConfig('contact-form');
  const agentConfig = getGoogleSheetsConfig('improvement-form');
  
  // Initialize default sheet
  if (defaultConfig.sheetId && defaultConfig.serviceAccountEmail && defaultConfig.privateKey) {
    await initializeSheet({
      sheetId: defaultConfig.sheetId,
      sheetName: defaultConfig.sheetName,
      serviceAccountEmail: defaultConfig.serviceAccountEmail,
      privateKey: defaultConfig.privateKey,
    }, 'default');
  }
  
  // Initialize agent sheet
  if (agentConfig.sheetId && agentConfig.serviceAccountEmail && agentConfig.privateKey) {
    await initializeSheet({
      sheetId: agentConfig.sheetId,
      sheetName: agentConfig.sheetName,
      serviceAccountEmail: agentConfig.serviceAccountEmail,
      privateKey: agentConfig.privateKey,
    }, 'agent');
  }
}

async function initializeSheet(
  config: { sheetId: string; sheetName: string; serviceAccountEmail: string; privateKey: string },
  type: 'default' | 'agent'
): Promise<void> {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: config.serviceAccountEmail,
        private_key: config.privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Check if headers exist, if not create them
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: config.sheetId,
      range: `${config.sheetName}!A1:G1`,
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
        spreadsheetId: config.sheetId,
        range: `${config.sheetName}!A1:G1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [headers],
        },
      });

      console.log(`Google Sheets headers initialized (${type})`);
    }
  } catch (error) {
    console.error(`Error initializing Google Sheet (${type}):`, error);
  }
}
