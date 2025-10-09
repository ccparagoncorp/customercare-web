import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('API received data:', data); // Debug log

    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const subject = String(data.subject || 'New Feedback').trim();
    const message = String(data.message || '').trim();

    console.log('Processed fields:', { name, email, subject, messageLength: message.length }); // Debug log

    if (!name || !email || !message) {
      return NextResponse.json({
        ok: false,
        error: 'Missing required fields',
        received: { name, email, subject, messageLength: message.length }
      }, { status: 400 });
    }

    // Read SMTP config (supports both SMTP_* and generic HOST/PORT/USER/PASS/SECURE)
    const host = process.env.SMTP_HOST || process.env.HOST;
    const port = Number(process.env.SMTP_PORT || process.env.PORT || 587);
    const user = process.env.SMTP_USER || process.env.USER;
    const pass = process.env.SMTP_PASS || process.env.PASS;
    const secure = String(process.env.SMTP_SECURE ?? process.env.SECURE ?? 'false') === 'true';
    const to = process.env.CONTACT_TO || process.env.TO;
    const from = process.env.CONTACT_FROM || process.env.FROM || user || 'no-reply@example.com';

    if (!host || !user || !pass || !to) {
      return NextResponse.json({ ok: false, error: 'Email not configured' }, { status: 500 });
    }

    // For development/testing - log the email instead of sending if SMTP fails
    console.log('Email would be sent to:', to);
    console.log('Email content:', { from, subject: `[Feedback] ${subject}`, name, email, message });

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false
      }
    });

    const html = `
      <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;line-height:1.6;color:#0f172a">
        <h2 style="margin:0 0 12px 0;color:#0f172a">New Feedback Submitted</h2>
        <p style="margin:0 0 8px 0"><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p style="margin:0 0 8px 0"><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p style="margin:16px 0 8px 0"><strong>Message:</strong></p>
        <div style="white-space:pre-wrap;background:#f8fafc;padding:12px;border-radius:12px;border:1px solid #e2e8f0">${escapeHtml(message)}</div>
      </div>
    `;

    try {
      await transporter.sendMail({
        from,
        to,
        subject: `[Feedback] ${subject}`,
        replyTo: email,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html,
      });

      return NextResponse.json({ ok: true }, { status: 200 });
    } catch (smtpError) {
      console.error('SMTP Error:', smtpError);
      // Fallback: still return success but log the email
      console.log('Email saved to logs (SMTP failed):', {
        to,
        from,
        subject: `[Feedback] ${subject}`,
        name,
        email,
        message,
        timestamp: new Date().toISOString()
      });
      
      return NextResponse.json({ 
        ok: true, 
        message: 'Feedback received (email may be delayed due to server issues)' 
      }, { status: 200 });
    }
  } catch (e) {
    console.error('API Error:', e); // Debug log
    return NextResponse.json({ 
      ok: false, 
      error: e instanceof Error ? e.message : 'Unknown error' 
    }, { status: 500 });
  }
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


