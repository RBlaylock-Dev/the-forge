'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForgeStore } from '@/store/useForgeStore';
import { useIsMobile } from '@/utils/mobile';
import { useFocusTrap } from '@/hooks/useFocusTrap';

const SUBJECT_OPTIONS = [
  'Hiring Inquiry',
  'Freelance Project',
  'Collaboration',
  'Just Saying Hi',
  'Other',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string; // honeypot
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const INITIAL_FORM: FormData = {
  name: '',
  email: '',
  subject: SUBJECT_OPTIONS[0],
  message: '',
  website: '',
};

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.trim().length > 100) {
    errors.name = 'Name must be under 100 characters';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'Please enter a valid email';
  }

  if (!data.subject) {
    errors.subject = 'Please select a subject';
  }

  if (!data.message.trim()) {
    errors.message = 'Message is required';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  } else if (data.message.trim().length > 2000) {
    errors.message = 'Message must be under 2000 characters';
  }

  return errors;
}

// ── Shared inline styles ──────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  fontSize: 14,
  fontFamily: 'var(--font-rajdhani), sans-serif',
  fontWeight: 500,
  borderRadius: 6,
  background: 'rgba(26, 21, 17, 0.6)',
  border: '1px solid rgba(196, 129, 58, 0.2)',
  color: '#f5deb3',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box' as const,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.5px',
  textTransform: 'uppercase' as const,
  color: 'rgba(245, 222, 179, 0.6)',
  marginBottom: 6,
};

const errorStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#ff6b6b',
  marginTop: 4,
};

/**
 * ContactModal — Full-screen form overlay for contacting Robert.
 * Forge-themed with validation and Resend email delivery.
 */
export function ContactModal() {
  const showContact = useForgeStore((s) => s.showContact);
  const closeContact = useForgeStore((s) => s.closeContact);
  const mobile = useIsMobile();

  const contactSubject = useForgeStore((s) => s.contactSubject);

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const focusTrapRef = useFocusTrap(showContact);

  const handleClose = useCallback(() => {
    closeContact();
    // Reset form after close animation
    setTimeout(() => {
      setFormData(INITIAL_FORM);
      setErrors({});
      setTouched(new Set());
      setSubmitted(false);
      setSubmitError('');
    }, 300);
  }, [closeContact]);

  // Pre-fill subject from contextual CTA
  useEffect(() => {
    if (showContact && contactSubject) {
      setFormData((prev) => ({ ...prev, subject: contactSubject }));
    }
  }, [showContact, contactSubject]);

  // Escape key
  useEffect(() => {
    if (!showContact) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showContact, handleClose]);

  if (!showContact) return null;

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSubmitError('');

    // Clear error on change if field was touched
    if (touched.has(field)) {
      const newData = { ...formData, [field]: value };
      const newErrors = validate(newData);
      setErrors((prev) => ({ ...prev, [field]: newErrors[field as keyof FormErrors] }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => new Set(prev).add(field));
    const newErrors = validate(formData);
    setErrors((prev) => ({ ...prev, [field]: newErrors[field as keyof FormErrors] }));
  };

  const handleSubmit = async () => {
    // Validate all fields
    const allErrors = validate(formData);
    setErrors(allErrors);
    setTouched(new Set(['name', 'email', 'subject', 'message']));

    if (Object.keys(allErrors).length > 0) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError('Failed to send. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const msgLen = formData.message.length;

  return (
    <div
      ref={focusTrapRef}
      className="font-rajdhani"
      role="dialog"
      aria-modal="true"
      aria-label="Contact form"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(10, 8, 6, 0.85)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      />

      {/* Modal */}
      <div
        style={
          mobile
            ? {
                position: 'relative',
                width: '100%',
                height: '100%',
                maxWidth: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: '#1a1511',
                border: 'none',
                borderRadius: 0,
                overflow: 'hidden',
              }
            : {
                position: 'relative',
                width: '90%',
                maxWidth: 520,
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                background: '#1a1511',
                border: '1px solid rgba(196, 129, 58, 0.3)',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 0 40px rgba(196, 129, 58, 0.15), 0 0 80px rgba(10, 8, 6, 0.8)',
              }
        }
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid rgba(196, 129, 58, 0.2)',
          }}
        >
          <h2
            className="font-cinzel"
            style={{
              margin: 0,
              fontSize: 17,
              fontWeight: 700,
              color: '#e8a54b',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            Send a Message to the Smith
          </h2>
          <button
            onClick={handleClose}
            aria-label="Close contact form"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              border: '1px solid rgba(196, 129, 58, 0.2)',
              borderRadius: 6,
              background: 'transparent',
              color: 'rgba(245, 222, 179, 0.5)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#f5deb3';
              e.currentTarget.style.borderColor = 'rgba(196, 129, 58, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(245, 222, 179, 0.5)';
              e.currentTarget.style.borderColor = 'rgba(196, 129, 58, 0.2)';
            }}
          >
            <svg
              width={14}
              height={14}
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
            >
              <path d="M2 2l10 10" />
              <path d="M12 2L2 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {submitted ? (
            /* ── Success state ────────────────────────────── */
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>&#128293;</div>
              <h3
                className="font-cinzel"
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#e8a54b',
                  marginBottom: 12,
                }}
              >
                Message Received!
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: 'rgba(245, 222, 179, 0.7)',
                  marginBottom: 28,
                  lineHeight: 1.6,
                }}
              >
                Robert will get back to you soon.
              </p>
              <button
                onClick={handleClose}
                style={{
                  padding: '10px 24px',
                  background: 'rgba(196, 129, 58, 0.15)',
                  border: '1px solid rgba(196, 129, 58, 0.4)',
                  borderRadius: 6,
                  color: '#e8a54b',
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: 'var(--font-rajdhani), sans-serif',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(196, 129, 58, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(196, 129, 58, 0.15)';
                }}
              >
                Return to The Forge
              </button>
            </div>
          ) : (
            /* ── Form ─────────────────────────────────────── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Honeypot — hidden from humans */}
              <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={(e) => updateField('website', e.target.value)}
                />
              </div>

              {/* Name */}
              <div>
                <label htmlFor="contact-name" style={labelStyle}>
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  placeholder="Your name"
                  maxLength={100}
                  aria-invalid={errors.name && touched.has('name') ? true : undefined}
                  aria-describedby={
                    errors.name && touched.has('name') ? 'contact-name-error' : undefined
                  }
                  style={{
                    ...inputStyle,
                    borderColor:
                      errors.name && touched.has('name')
                        ? 'rgba(255, 107, 107, 0.5)'
                        : inputStyle.border
                          ? undefined
                          : undefined,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(232, 165, 75, 0.6)';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(196, 129, 58, 0.15)';
                  }}
                  onBlurCapture={(e) => {
                    if (!(errors.name && touched.has('name'))) {
                      e.currentTarget.style.borderColor = 'rgba(196, 129, 58, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                />
                {errors.name && touched.has('name') && (
                  <div id="contact-name-error" role="alert" style={errorStyle}>
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="contact-email" style={labelStyle}>
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="your@email.com"
                  aria-invalid={errors.email && touched.has('email') ? true : undefined}
                  aria-describedby={
                    errors.email && touched.has('email') ? 'contact-email-error' : undefined
                  }
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(232, 165, 75, 0.6)';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(196, 129, 58, 0.15)';
                  }}
                  onBlurCapture={(e) => {
                    if (!(errors.email && touched.has('email'))) {
                      e.currentTarget.style.borderColor = 'rgba(196, 129, 58, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                />
                {errors.email && touched.has('email') && (
                  <div id="contact-email-error" role="alert" style={errorStyle}>
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="contact-subject" style={labelStyle}>
                  Subject
                </label>
                <select
                  id="contact-subject"
                  value={formData.subject}
                  onChange={(e) => updateField('subject', e.target.value)}
                  style={{
                    ...inputStyle,
                    appearance: 'none' as const,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23c4813a' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    paddingRight: 36,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(232, 165, 75, 0.6)';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(196, 129, 58, 0.15)';
                  }}
                  onBlurCapture={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(196, 129, 58, 0.2)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {SUBJECT_OPTIONS.map((opt) => (
                    <option
                      key={opt}
                      value={opt}
                      style={{ background: '#1a1511', color: '#f5deb3' }}
                    >
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <label htmlFor="contact-message" style={labelStyle}>
                    Message
                  </label>
                  <span
                    style={{
                      fontSize: 11,
                      color: msgLen > 1900 ? '#ff6b6b' : 'rgba(245, 222, 179, 0.3)',
                    }}
                  >
                    {msgLen}/2000
                  </span>
                </div>
                <textarea
                  id="contact-message"
                  value={formData.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  onBlur={() => handleBlur('message')}
                  placeholder="What would you like to discuss?"
                  maxLength={2000}
                  rows={5}
                  aria-invalid={errors.message && touched.has('message') ? true : undefined}
                  aria-describedby={
                    errors.message && touched.has('message') ? 'contact-message-error' : undefined
                  }
                  style={{
                    ...inputStyle,
                    resize: 'vertical' as const,
                    minHeight: 100,
                    lineHeight: 1.5,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(232, 165, 75, 0.6)';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(196, 129, 58, 0.15)';
                  }}
                  onBlurCapture={(e) => {
                    if (!(errors.message && touched.has('message'))) {
                      e.currentTarget.style.borderColor = 'rgba(196, 129, 58, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                />
                {errors.message && touched.has('message') && (
                  <div id="contact-message-error" role="alert" style={errorStyle}>
                    {errors.message}
                  </div>
                )}
              </div>

              {/* Submit error */}
              {submitError && (
                <div style={{ ...errorStyle, textAlign: 'center', padding: '8px 0' }}>
                  {submitError}
                </div>
              )}

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  marginTop: 4,
                  background: isSubmitting
                    ? 'rgba(196, 129, 58, 0.08)'
                    : 'rgba(196, 129, 58, 0.15)',
                  border: '1px solid rgba(196, 129, 58, 0.4)',
                  borderRadius: 6,
                  color: isSubmitting ? 'rgba(232, 165, 75, 0.5)' : '#e8a54b',
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: 'var(--font-rajdhani), sans-serif',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.background = 'rgba(196, 129, 58, 0.25)';
                    e.currentTarget.style.boxShadow = '0 0 16px rgba(196, 129, 58, 0.25)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isSubmitting
                    ? 'rgba(196, 129, 58, 0.08)'
                    : 'rgba(196, 129, 58, 0.15)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
