'use client';

import { useState, useRef } from 'react';
import contactContent from '@/content/contact.json';
import { ScrollAnimation, ScaleAnimation } from '@/components/animations';

type Field = { id: string; label: string; type: string; required?: boolean; placeholder?: string };

export default function ContactForm() {
  const { form } = contactContent;
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

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
        body: JSON.stringify({
          ...payload,
          source: 'contact-form'
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Request failed');
      }
      setStatus('success');
      setMessage(form.successMessage);
      formRef.current?.reset();
    } catch (err) {
      setStatus('error');
      setMessage((err as Error).message || form.errorMessage);
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12">
        <ScaleAnimation scale={0.95}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 md:p-10">
            <ScrollAnimation direction="up" delay={0.2}>
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{form.title}</h2>
                <p className="mt-2 text-gray-500 text-xs sm:text-sm">{form.subtitle}</p>
              </div>
            </ScrollAnimation>
          <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {(form.fields as Field[]).map((f) => (
              <div key={f.id} className={`${['name','email'].includes(f.id) ? '' : 'md:col-span-2'}`}>
                <label htmlFor={f.id} className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  {f.label}
                </label>
                {f.type === 'textarea' ? (
                  <textarea
                    id={f.id}
                    name={f.id}
                    required={f.required}
                    placeholder={f.placeholder}
                    className="w-full rounded-xl border border-gray-300 bg-white p-3 min-h-[120px] sm:min-h-[140px] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#03438f] focus:border-[#03438f] resize-none text-sm sm:text-base"
                  />
                ) : (
                  <input
                    id={f.id}
                    name={f.id}
                    type={f.type}
                    required={f.required}
                    placeholder={f.placeholder}
                    className="w-full rounded-xl border border-gray-300 bg-white p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#03438f] focus:border-[#03438f] text-sm sm:text-base"
                  />
                )}
              </div>
            ))}

            <div className="md:col-span-2 pt-1">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#03438f] text-white px-6 py-3 font-semibold hover:bg-[#013b7c] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base"
              >
                {status === 'loading' && (
                  <span className="inline-block w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                )}
                {form.submitButton}
              </button>
            </div>

            {message && (
              <div className={`md:col-span-2 mt-2 rounded-xl px-4 py-3 text-sm ${status === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message}
              </div>
            )}
          </form>
        </div>
        </ScaleAnimation>
      </div>
    </section>
  );
}


