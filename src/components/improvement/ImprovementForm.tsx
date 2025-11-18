'use client';

import { useState, useRef } from 'react';
import improvementContent from '@/content/improvement.json';
import { ScrollAnimation, ScaleAnimation } from '@/components/animations';
import { useAuth } from '@/components/auth/AuthProvider';

export default function ImprovementForm() {
  const { form } = improvementContent;
  const { user } = useAuth();
  const [isAnonymous, setIsAnonymous] = useState<boolean | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isAnonymous === null) {
      setMessage('Please choose whether to submit anonymously or include your details.');
      setStatus('error');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const payload: Record<string, string> = {};
    formData.forEach((value, key) => (payload[key] = String(value)));

    const messageV = (payload.message || '').trim();
    if (!messageV) {
      setMessage('Please fill in the improvement suggestion field.');
      setStatus('error');
      return;
    }

    // If not anonymous, get name and role from logged in user
    if (!isAnonymous) {
      if (!user) {
        setMessage('You must be logged in to include your details.');
        setStatus('error');
        return;
      }
      // Get name and role from user
      payload.name = user.name || user.email || 'Unknown';
      // Use role from user or default to category/role
      payload.role = user.category || 'agent';
    } else {
      // Anonymous submission
      payload.name = 'Anonymous';
      payload.role = '';
    }

    payload.message = messageV;
    
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          email: isAnonymous ? 'anonymous@improvement.com' : (user?.email || 'n/a@improvement.com'),
          subject: isAnonymous ? 'Anonymous Improvement' : `Improvement from ${payload.name}`,
          source: 'improvement-form'
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Request failed');
      }
      setStatus('success');
      setMessage(form.successMessage);
      formRef.current?.reset();
      setIsAnonymous(null);
    } catch (err) {
      setStatus('error');
      setMessage((err as Error).message || form.errorMessage);
    }
  };

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScaleAnimation scale={0.95}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 md:p-10">
            <ScrollAnimation direction="up" delay={0.2}>
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{form.title}</h2>
                <p className="mt-2 text-gray-500 text-xs sm:text-sm">{form.subtitle}</p>
              </div>
            </ScrollAnimation>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Anonymous choice */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Submission Type <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <label className="flex items-center p-3 rounded-xl border-2 cursor-pointer transition-colors hover:bg-gray-50"
                    style={{ 
                      borderColor: isAnonymous === true ? '#03438f' : '#e5e7eb',
                      backgroundColor: isAnonymous === true ? '#f0f7ff' : 'transparent'
                    }}
                  >
                    <input
                      type="radio"
                      name="anonymous"
                      checked={isAnonymous === true}
                      onChange={() => setIsAnonymous(true)}
                      className="mr-3 w-4 h-4 text-[#03438f]"
                    />
                    <span className="text-sm sm:text-base text-gray-700">{form.anonymousLabel}</span>
                  </label>
                  <label className="flex items-center p-3 rounded-xl border-2 cursor-pointer transition-colors hover:bg-gray-50"
                    style={{ 
                      borderColor: isAnonymous === false ? '#03438f' : '#e5e7eb',
                      backgroundColor: isAnonymous === false ? '#f0f7ff' : 'transparent'
                    }}
                  >
                    <input
                      type="radio"
                      name="anonymous"
                      checked={isAnonymous === false}
                      onChange={() => setIsAnonymous(false)}
                      className="mr-3 w-4 h-4 text-[#03438f]"
                    />
                    <span className="text-sm sm:text-base text-gray-700">{form.notAnonymousLabel}</span>
                  </label>
                </div>
              </div>

              {/* User info display - shown only if not anonymous */}
              {/* {isAnonymous === false && user && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 animate-in fade-in duration-300">
                  <p className="text-sm font-medium text-blue-900 mb-2">Your information will be included:</p>
                  <div className="space-y-1 text-sm text-blue-700">
                    <p><strong>Name:</strong> {user.name || user.email || 'Unknown'}</p>
                    <p><strong>Role:</strong> {user.category || 'agent'}</p>
                  </div>
                </div>
              )} */}

              {/* Message field */}
              <div>
                <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  {form.messageLabel} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  placeholder={form.messagePlaceholder}
                  className="w-full rounded-xl border border-gray-300 bg-white p-3 min-h-[120px] sm:min-h-[140px] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#03438f] focus:border-[#03438f] resize-none text-sm sm:text-base"
                />
              </div>

              {/* Submit button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={status === 'loading' || isAnonymous === null}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#03438f] text-white px-6 py-3 font-semibold hover:bg-[#013b7c] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base"
                >
                  {status === 'loading' && (
                    <span className="inline-block w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                  )}
                  {form.submitButton}
                </button>
              </div>

              {/* Status message */}
              {message && (
                <div className={`mt-2 rounded-xl px-4 py-3 text-sm ${status === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
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

