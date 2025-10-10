import { NextResponse } from 'next/server';
import { initializeGoogleSheet } from '@/lib/googleSheets';

export async function POST() {
  try {
    await initializeGoogleSheet();
    return NextResponse.json({ 
      ok: true, 
      message: 'Google Sheets headers initialized successfully' 
    });
  } catch (error) {
    console.error('Error initializing Google Sheets:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to initialize Google Sheets' 
    }, { status: 500 });
  }
}
