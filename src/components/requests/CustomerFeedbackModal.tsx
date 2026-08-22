import React, { useState } from 'react';
import { Star, MessageSquare, CheckCircle2, Sparkles, X, HeartHandshake } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useToast } from '../ui/Toast';

export interface CustomerFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  ticketNumber: string;
  onSubmitFeedback: (data: {
    requestId: string;
    rating: number;
    responseQualityRating: number;
    slaSatisfactionRating: number;
    comment: string;
  }) => Promise<void>;
}

export function CustomerFeedbackModal({
  isOpen,
  onClose,
  requestId,
  ticketNumber,
  onSubmitFeedback,
}: CustomerFeedbackModalProps) {
  const { showToast } = useToast();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [responseQuality, setResponseQuality] = useState<number>(5);
  const [slaSatisfaction, setSlaSatisfaction] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmitFeedback({
        requestId,
        rating,
        responseQualityRating: responseQuality,
        slaSatisfactionRating: slaSatisfaction,
        comment,
      });
      setIsSubmitted(true);
      showToast('Feedback Submitted', 'Thank you! Your feedback helps us continuously improve our SLA response.', 'success');
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 1800);
    } catch (err: any) {
      showToast('Submission Failed', err.message || 'Unable to submit feedback', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-slate-900 to-[#0A0E17] border border-indigo-500/30 p-6 shadow-2xl text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Thank You for Your Feedback!</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Your rating has been recorded into our SLA Customer Satisfaction & MTTR Intelligence telemetry.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                  <Sparkles className="h-3 w-3" />
                  INCIDENT RESOLVED
                </span>
                <span className="text-xs font-mono text-slate-400">{ticketNumber}</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">How was your SLA resolution experience?</h3>
              <p className="text-xs text-slate-400">
                Help us evaluate our engineering response velocity and SLA adherence.
              </p>
            </div>

            {/* Overall Star Rating */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">Overall Satisfaction</span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-2xl transition transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-medium text-amber-300">
                {rating === 5 ? '⭐⭐⭐⭐⭐ Exceptional (Exceeded SLA)' :
                 rating === 4 ? '⭐⭐⭐⭐ Great Response' :
                 rating === 3 ? '⭐⭐⭐ Satisfactory' :
                 rating === 2 ? '⭐⭐ Needs Improvement' : '⭐ Unsatisfactory'}
              </span>
            </div>

            {/* Secondary Granular Ratings */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-slate-300 font-semibold block">Response Quality</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setResponseQuality(val)}
                      className={`h-7 w-7 rounded-lg text-xs font-bold transition ${
                        responseQuality >= val
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-slate-300 font-semibold block">SLA Timeliness</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSlaSatisfaction(val)}
                      className={`h-7 w-7 rounded-lg text-xs font-bold transition ${
                        slaSatisfaction >= val
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Qualitative Feedback Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
                <span>What can our team improve or what went well?</span>
              </label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share specific details regarding engineer responsiveness, root-cause transparency, or resolution speed..."
                rows={3}
                className="w-full rounded-xl bg-slate-900/90 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-white"
              >
                Skip for Now
              </Button>
              <Button
                type="submit"
                variant="ai-glow"
                size="sm"
                disabled={isSubmitting}
                className="text-xs shadow-lg shadow-indigo-600/30"
              >
                {isSubmitting ? 'Submitting...' : 'Submit SLA Feedback'}
              </Button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
