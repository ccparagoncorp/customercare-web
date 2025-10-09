'use client';

import { useState } from 'react';
import contactContent from '@/content/contact.json';

type Field = { id: string; label: string; type: string; required?: boolean; placeholder?: string };

export default function ContactForm() {
  const { form } = contactContent;
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload: Record<string, string> = {};
    formData.forEach((value, key) => (payload[key] = String(value)));
    // Client-side validation to prevent 400s
    const nameV = (payload.name || '').trim();
    const emailV = (payload.email || '').trim();
    const subjectV = (payload.subject || '').trim() || 'New Feedback';
    const messageV = (payload.message || '').trim();
    if (!nameV || !emailV || !messageV) {
      setMessage('Please fill all required fields (name, email, message).');
      setStatus('error');
      return;
    }
    payload.name = nameV;
    payload.email = emailV;
    payload.subject = subjectV;
    payload.message = messageV;
    
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Request failed');
      }
      setStatus('success');
      setMessage(form.successMessage);
      e.currentTarget.reset();
    } catch (err) {
      setStatus('error');
      setMessage((err as Error).message || form.errorMessage);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-10">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{form.title}</h2>
            <p className="mt-2 text-gray-500 text-sm">We value your thoughts. Please fill out the form and our team will respond shortly.</p>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(form.fields as Field[]).map((f) => (
              <div key={f.id} className={`${['name','email'].includes(f.id) ? '' : 'md:col-span-2'}`}>
                <label htmlFor={f.id} className="block text-sm font-medium text-gray-700 mb-2">
                  {f.label}
                </label>
                {f.type === 'textarea' ? (
                  <textarea
                    id={f.id}
                    name={f.id}
                    required={f.required}
                    placeholder={f.placeholder}
                    className="w-full rounded-xl border border-gray-300 bg-white p-3 min-h-[140px] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#03438f] focus:border-[#03438f] resize-none"
                  />
                ) : (
                  <input
                    id={f.id}
                    name={f.id}
                    type={f.type}
                    required={f.required}
                    placeholder={f.placeholder}
                    className="w-full rounded-xl border border-gray-300 bg-white p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#03438f] focus:border-[#03438f]"
                  />
                )}
              </div>
            ))}

            <div className="md:col-span-2 flex items-start gap-3">
              <input id="consent" name="consent" type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-[#03438f] focus:ring-[#03438f]" />
              <label htmlFor="consent" className="text-sm text-gray-600">I agree to be contacted about my feedback.</label>
            </div>

            <div className="md:col-span-2 pt-1">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#03438f] text-white px-6 py-3 font-semibold hover:bg-[#013b7c] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'loading' && (
                  <span className="inline-block w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                )}
                Submit Feedback
              </button>
            </div>

            {message && (
              <div className={`md:col-span-2 mt-2 rounded-xl px-4 py-3 text-sm ${status === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}


