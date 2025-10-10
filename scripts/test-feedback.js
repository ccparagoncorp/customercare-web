// Test script to send feedback and verify Google Sheets integration
require('dotenv').config({ path: '.env' });

async function testFeedback() {
  console.log('🧪 Testing Feedback Integration...\n');

  // Test data untuk contact form
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Feedback Title',
    message: 'This is a test message from script',
    source: 'contact-form'
  };

  try {
    console.log('📤 Sending test feedback...');
    const response = await fetch('http://localhost:3000/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    
    if (response.ok && result.ok) {
      console.log('✅ Feedback sent successfully!');
      console.log('📧 Email notification sent');
      console.log('📊 Data saved to Google Sheets');
      console.log('\n📋 Test Data Sent:');
      console.log('- Name:', testData.name);
      console.log('- Email:', testData.email);
      console.log('- Title:', testData.subject, '(akan masuk ke kolom title)');
      console.log('- Feedback:', testData.message);
      console.log('- Source:', testData.source);
      console.log('- Rating:', 'kosong (karena ini contact form)');
    } else {
      console.log('❌ Feedback failed:', result.error || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ Error sending feedback:', error.message);
    console.log('💡 Make sure your development server is running (npm run dev)');
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000');
    if (response.ok) {
      console.log('✅ Development server is running');
      return true;
    }
  } catch (error) {
    console.log('❌ Development server is not running');
    console.log('💡 Please run: npm run dev');
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await testFeedback();
  }
}

main();
