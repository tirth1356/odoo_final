import React, { useState, useEffect, useRef } from 'react';

/**
 * BrutalistModal – a fully styled Neo-Brutalist dialog component.
 *
 * Props
 * ─────
 * isOpen       boolean            Whether the modal is visible
 * onClose      () => void         Called on Cancel / backdrop click / Escape
 * title        string             Header title text
 * icon         string             Material Symbols icon name (default: 'info')
 * type         'alert' | 'confirm' | 'prompt' | 'form'
 *
 * For type='alert':
 *   message    string             Body message text
 *   variant    'info'|'success'|'error'|'warning'
 *   onConfirm  () => void         OK button callback
 *
 * For type='confirm':
 *   message    string             Body message text
 *   confirmLabel  string          (default: 'Confirm')
 *   cancelLabel   string          (default: 'Cancel')
 *   onConfirm  () => void         Called on confirmation
 *
 * For type='prompt':
 *   fields     Array<{ name, label, placeholder?, type? }>
 *   onConfirm  (values: Record<string,string>) => void
 *
 * For type='form':  (custom slot)
 *   children   ReactNode          Any JSX rendered inside the body
 *   onConfirm  () => void         Confirm button callback
 */

const VARIANT_STYLES = {
  info:    { accent: 'bg-primary-fixed', icon: 'info', headerBg: 'bg-surface' },
  success: { accent: 'bg-secondary-container', icon: 'check_circle', headerBg: 'bg-secondary-container' },
  error:   { accent: 'bg-error-container', icon: 'error', headerBg: 'bg-error-container' },
  warning: { accent: 'bg-tertiary-fixed', icon: 'warning', headerBg: 'bg-tertiary-fixed' },
};

export default function BrutalistModal({
  isOpen,
  onClose,
  title = 'Dialog',
  icon,
  type = 'alert',
  message,
  variant = 'info',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  fields = [],
  children,
}) {
  const [fieldValues, setFieldValues] = useState({});
  const firstInputRef = useRef(null);

  // Reset field values when opened
  useEffect(() => {
    if (isOpen) {
      const initial = {};
      fields.forEach(f => { initial[f.name] = ''; });
      setFieldValues(initial);
      // Focus first input on next tick
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [isOpen, fields]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && isOpen) onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const variantStyle = VARIANT_STYLES[variant] || VARIANT_STYLES.info;
  const resolvedIcon = icon || variantStyle.icon;

  const handleConfirm = () => {
    if (type === 'prompt') {
      // Validate all fields are filled
      const allFilled = fields.every(f => fieldValues[f.name]?.trim());
      if (!allFilled) return;
      onConfirm?.(fieldValues);
    } else {
      onConfirm?.();
    }
    onClose?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && type === 'prompt') {
      handleConfirm();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(28, 27, 27, 0.75)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="brutalist-modal-title"
    >
      {/* Modal Panel */}
      <div
        className="relative w-full max-w-md bg-surface border-4 border-on-surface"
        style={{ boxShadow: '12px 12px 0px 0px rgba(28,27,27,1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b-2 border-on-surface ${variantStyle.headerBg}`}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface" style={{ fontSize: '22px' }}>
              {resolvedIcon}
            </span>
            <h3
              id="brutalist-modal-title"
              className="font-headline-md text-on-surface uppercase tracking-tighter"
              style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}
            >
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-2 border-on-surface bg-surface hover:bg-surface-container-high transition-colors"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">
          {/* Alert / Confirm message */}
          {(type === 'alert' || type === 'confirm') && message && (
            <p className="font-body-md text-on-surface-variant leading-relaxed text-sm">
              {message}
            </p>
          )}

          {/* Prompt fields */}
          {type === 'prompt' && fields.map((field, idx) => (
            <div key={field.name} className="space-y-1">
              <label className="block font-label-bold text-on-surface uppercase tracking-wide" style={{ fontSize: '10px' }}>
                {field.label}
              </label>
              <input
                ref={idx === 0 ? firstInputRef : null}
                type={field.type || 'text'}
                value={fieldValues[field.name] || ''}
                onChange={(e) => setFieldValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                onKeyDown={handleKeyDown}
                placeholder={field.placeholder || ''}
                className="w-full h-11 px-4 border-2 border-on-surface bg-surface-container-lowest font-body-md text-sm focus:outline-none focus:ring-2 focus:ring-secondary placeholder:text-on-surface-variant placeholder:uppercase placeholder:text-[10px]"
              />
            </div>
          ))}

          {/* Custom children for 'form' type */}
          {type === 'form' && children}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t-2 border-on-surface flex items-center justify-end gap-3 bg-surface-container-low">
          {type !== 'alert' && (
            <button
              onClick={onClose}
              className="px-5 py-2 font-label-bold uppercase text-on-surface-variant hover:text-on-surface text-xs border-2 border-transparent hover:border-on-surface transition-all"
            >
              {cancelLabel}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="px-7 py-3 font-headline-md uppercase border-2 border-on-surface text-sm transition-all"
            style={{
              backgroundColor: '#38fe13',
              color: '#022100',
              boxShadow: '4px 4px 0px 0px rgba(28,27,27,1)',
              fontWeight: 700,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translate(-2px, -2px)';
              e.currentTarget.style.boxShadow = '6px 6px 0px 0px rgba(28,27,27,1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '4px 4px 0px 0px rgba(28,27,27,1)';
            }}
            onMouseDown={e => {
              e.currentTarget.style.transform = 'translate(2px, 2px)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onMouseUp={e => {
              e.currentTarget.style.transform = 'translate(-2px, -2px)';
              e.currentTarget.style.boxShadow = '6px 6px 0px 0px rgba(28,27,27,1)';
            }}
          >
            {type === 'alert' ? 'OK' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
