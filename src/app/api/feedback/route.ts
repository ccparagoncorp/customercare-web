import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { saveToGoogleSheets, FeedbackData } from '@/lib/googleSheets';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const subject = String(data.subject || 'New Feedback').trim();
    const message = String(data.message || '').trim();
    const role = String(data.role || '').trim();
    const source = String(data.source || 'contact-form').trim() as 'contact-form' | 'feedback-widget' | 'improvement-form';
    const rating = data.rating ? Number(data.rating) : undefined;

    // Validation - improvement form doesn't require email to be valid
    if (source === 'improvement-form') {
      if (!name || !message) {
        return NextResponse.json({
          ok: false,
          error: 'Missing required fields',
          received: { name, messageLength: message.length }
        }, { status: 400 });
      }
    } else {
      if (!name || !email || !message) {
        return NextResponse.json({
          ok: false,
          error: 'Missing required fields',
          received: { name, email, subject, messageLength: message.length }
        }, { status: 400 });
      }
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
        <h2 style="margin:0 0 12px 0;color:#0f172a">New ${source === 'improvement-form' ? 'Improvement' : 'Feedback'} Submitted</h2>
        <p style="margin:0 0 8px 0"><strong>Name:</strong> ${escapeHtml(name)}</p>
        ${source !== 'improvement-form' ? `<p style="margin:0 0 8px 0"><strong>Email:</strong> ${escapeHtml(email)}</p>` : ''}
        ${source === 'improvement-form' && role ? `<p style="margin:0 0 8px 0"><strong>Role:</strong> ${escapeHtml(role)}</p>` : ''}
        ${source === 'contact-form' ? `<p style="margin:0 0 8px 0"><strong>Subject:</strong> ${escapeHtml(subject)}</p>` : ''}
        ${source === 'feedback-widget' && rating ? `<p style="margin:0 0 8px 0"><strong>Rating:</strong> ${rating}/5</p>` : ''}
        <p style="margin:16px 0 8px 0"><strong>Message:</strong></p>
        <div style="white-space:pre-wrap;background:#f8fafc;padding:12px;border-radius:12px;border:1px solid #e2e8f0">${escapeHtml(message)}</div>
      </div>
    `;

    try {
      // Send email
      const mailOptions: {
        from: string;
        to: string;
        subject: string;
        text: string;
        html: string;
        replyTo?: string;
      } = {
        from,
        to,
        subject: `[${source === 'improvement-form' ? 'Improvement' : 'Feedback'}] ${subject}`,
        text: `Name: ${name}${source !== 'improvement-form' ? `\nEmail: ${email}` : ''}${source === 'improvement-form' && role ? `\nRole: ${role}` : ''}\n\n${message}`,
        html,
      };
      
      // Only add replyTo for non-improvement forms
      if (source !== 'improvement-form') {
        mailOptions.replyTo = email;
      }
      
      await transporter.sendMail(mailOptions);

      // Save to Google Sheets
      const feedbackData: FeedbackData = {
        name,
        email,
        title: source === 'contact-form' ? subject : source === 'improvement-form' ? role : undefined, // subject untuk contact form, role untuk improvement form
        rating: source === 'feedback-widget' ? rating : undefined, // hanya untuk feedback widget
        feedback: message,
        source,
        timestamp: new Date().toISOString(),
      };

      await saveToGoogleSheets(feedbackData);

      return NextResponse.json({ ok: true }, { status: 200 });
    } catch (smtpError) {
      console.error('SMTP Error:', smtpError);
      // Fallback: still return success but log the email and try to save to Google Sheets

      // Try to save to Google Sheets even if email fails
      const feedbackData: FeedbackData = {
        name,
        email,
        title: source === 'contact-form' ? subject : source === 'improvement-form' ? role : undefined, // subject untuk contact form, role untuk improvement form
        rating: source === 'feedback-widget' ? rating : undefined, // hanya untuk feedback widget
        feedback: message,
        source,
        timestamp: new Date().toISOString(),
      };

      await saveToGoogleSheets(feedbackData);
      
      return NextResponse.json({ 
        ok: true, 
        message: 'Feedback received (email may be delayed due to server issues)' 
      }, { status: 200 });
    }
  } catch (e) {
    console.error('API Error:', e);
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


