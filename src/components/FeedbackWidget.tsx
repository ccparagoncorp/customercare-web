'use client';

import { useState } from 'react';
import layoutContent from '@/content/layout.json';

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setFeedbackMessage(layoutContent.feedback.modal.messages.selectRating);
      setStatus('error');
      return;
    }

    setStatus('loading');
    setFeedbackMessage('');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Anonymous User',
          email: 'anonymous@feedback.com',
          subject: `Feedback - ${rating} Star Rating`,
          message: `Rating: ${rating}/5 stars\n\nMessage: ${message || layoutContent.feedback.modal.messages.noMessage}`,
          source: 'feedback-widget',
          rating: rating
        }),
      });

      if (res.ok) {
        setStatus('success');
        setFeedbackMessage(layoutContent.feedback.modal.messages.success);
        setRating(0);
        setMessage('');
        setTimeout(() => {
          setIsOpen(false);
          setStatus('idle');
          setFeedbackMessage('');
        }, 2000);
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (err) {
      setStatus('error');
      setFeedbackMessage(layoutContent.feedback.modal.messages.error);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#03438f] hover:bg-[#012f65] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
        aria-label={layoutContent.feedback.floatingButton.ariaLabel}
      >
        <svg 
          className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" 
          />
        </svg>
      </button>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">{layoutContent.feedback.modal.title}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1"
                  aria-label={layoutContent.feedback.modal.closeButton.ariaLabel}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Rating Section */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                  {layoutContent.feedback.modal.rating.label}
                </label>
                <div className="flex gap-1 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoveredStar ?? rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(null)}
                        onClick={() => setRating(star)}
                        aria-label={layoutContent.feedback.modal.rating.starLabels[star.toString() as keyof typeof layoutContent.feedback.modal.rating.starLabels]}
                        className="p-1 sm:p-1.5 transition-transform duration-150 hover:scale-105 cursor-pointer"
                      >
                        <svg
                          className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ${active ? 'text-yellow-400' : 'text-gray-300'}`}
                          viewBox="0 0 24 24"
                          fill={active ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          strokeWidth={active ? 0 : 2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message Section */}
              <form onSubmit={handleSubmit}>
                <div className="mb-4 sm:mb-6">
                  <label htmlFor="feedback-message" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    {layoutContent.feedback.modal.message.label}
                  </label>
                  <textarea
                    id="feedback-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={layoutContent.feedback.modal.message.placeholder}
                    className="w-full rounded-xl border border-gray-300 bg-white p-3 min-h-[80px] sm:min-h-[100px] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#03438f] focus:border-[#03438f] resize-none text-sm sm:text-base"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'loading' || rating === 0}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#03438f] text-white px-4 sm:px-6 py-2.5 sm:py-3 font-semibold hover:bg-[#013b7c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer text-sm sm:text-base"
                >
                  {status === 'loading' && (
                    <span className="inline-block w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                  )}
                  {layoutContent.feedback.modal.submitButton}
                </button>

                {/* Status Message */}
                {feedbackMessage && (
                  <div className={`mt-4 rounded-xl px-4 py-3 text-sm ${
                    status === 'success' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {feedbackMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
