// Debug script for Google Sheets configuration
require('dotenv').config({ path: '.env' });

console.log('🔍 Debugging Google Sheets Configuration...\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log('GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID ? '✅ Set' : '❌ Missing');
console.log('GOOGLE_SHEET_NAME:', process.env.GOOGLE_SHEET_NAME || 'Feedback (default)');
console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✅ Set' : '❌ Missing');
console.log('GOOGLE_PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? '✅ Set' : '❌ Missing');

if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
  console.log('\n❌ Missing required environment variables!');
  console.log('Please check your .env.local file.');
  process.exit(1);
}

console.log('\n📊 Configuration Details:');
console.log('Sheet ID:', process.env.GOOGLE_SHEET_ID);
console.log('Sheet Name:', process.env.GOOGLE_SHEET_NAME || 'Feedback');
console.log('Service Account:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);

// Validate and extract Sheet ID format
let sheetId = process.env.GOOGLE_SHEET_ID;
if (sheetId.includes('docs.google.com/spreadsheets/d/')) {
  // Extract ID from URL
  const match = sheetId.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match) {
    sheetId = match[1];
    console.log('\n🔧 Extracted Sheet ID from URL:', sheetId);
    console.log('💡 Please update your .env file to use just the ID:');
    console.log(`GOOGLE_SHEET_ID=${sheetId}`);
  }
}

if (sheetId.length < 10 || sheetId.includes(' ')) {
  console.log('\n⚠️  Warning: Sheet ID format looks suspicious');
  console.log('Expected format: long string without spaces');
  console.log('Your ID:', sheetId);
}

// Validate Private Key format
const privateKey = process.env.GOOGLE_PRIVATE_KEY;
if (!privateKey.includes('-----BEGIN PRIVATE KEY-----') || !privateKey.includes('-----END PRIVATE KEY-----')) {
  console.log('\n⚠️  Warning: Private Key format looks suspicious');
  console.log('Should contain: -----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY-----');
}

console.log('\n💡 Next Steps:');
console.log('1. Verify Sheet ID is correct (from Google Sheets URL)');
console.log('2. Make sure service account email is shared with the spreadsheet');
console.log('3. Check that sheet name matches exactly (case-sensitive)');

// Test basic authentication
async function testAuth() {
  try {
    const { google } = require('googleapis');
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    console.log('\n🔐 Testing authentication...');
    const authClient = await auth.getClient();
    console.log('✅ Authentication successful');
    
    const sheets = google.sheets({ version: 'v4', auth: authClient });
    
    console.log('\n📖 Testing sheet access...');
    const response = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });
    
    console.log('✅ Sheet found!');
    console.log('Sheet Title:', response.data.properties?.title);
    console.log('Available Sheets:', response.data.sheets?.map(s => s.properties?.title));
    
    // Check current headers
    try {
      const headersResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${process.env.GOOGLE_SHEET_NAME || 'Feedback'}!A1:G1`,
      });
      
      const headers = headersResponse.data.values?.[0];
      if (headers && headers.length > 0) {
        console.log('\n📋 Current Headers:');
        console.log('A:', headers[0] || 'kosong');
        console.log('B:', headers[1] || 'kosong');
        console.log('C:', headers[2] || 'kosong');
        console.log('D:', headers[3] || 'kosong');
        console.log('E:', headers[4] || 'kosong');
        console.log('F:', headers[5] || 'kosong');
        console.log('G:', headers[6] || 'kosong');
        
        console.log('\n📝 Expected Headers:');
        console.log('A: timestamp');
        console.log('B: email');
        console.log('C: name');
        console.log('D: title');
        console.log('E: rating');
        console.log('F: feedback');
        console.log('G: source');
      } else {
        console.log('\n📋 No headers found - will be created on first data entry');
      }
    } catch (headerError) {
      console.log('\n⚠️  Could not check headers:', headerError.message);
    }
    
  } catch (error) {
    console.log('\n❌ Error:', error.message);
    
    if (error.message.includes('not found')) {
      console.log('\n💡 Troubleshooting:');
      console.log('- Check if GOOGLE_SHEET_ID is correct');
      console.log('- Make sure the spreadsheet exists');
      console.log('- Verify service account has access to the sheet');
    } else if (error.message.includes('permission')) {
      console.log('\n💡 Troubleshooting:');
      console.log('- Share the spreadsheet with service account email');
      console.log('- Give Editor access to the service account');
    } else if (error.message.includes('credentials')) {
      console.log('\n💡 Troubleshooting:');
      console.log('- Check GOOGLE_SERVICE_ACCOUNT_EMAIL');
      console.log('- Check GOOGLE_PRIVATE_KEY format');
    }
  }
}

testAuth();
