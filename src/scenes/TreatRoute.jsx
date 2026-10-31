import { useState, useRef } from 'react';
import { validateTreatForm } from '../utils/validation';
import { audioManager } from '../utils/audio';
import './TreatRoute.css';

/**
 * TREAT ROUTE
 * Sub-steps: 'intro' → 'form' → 'sealed'
 */
const TreatRoute = ({ onComplete, onUpdateParticipant, participant, soundEnabled }) => {
  const [subStep, setSubStep]   = useState('intro');
  const [exiting, setExiting]   = useState(false);
  const [form, setForm]         = useState({
    name:          participant.name || '',
    chocolate:     '',
    quantity:      '',
    signature:     '',
    agreedPromise: false,
  });
  const [errors, setErrors]     = useState({});
  const [submitting, setSubmit] = useState(false);
  const locked                  = useRef(false);

  const goToForm = () => {
    if (locked.current) return;
    locked.current = true;
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      setSubStep('form');
      locked.current = false;
    }, 600);
  };

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
  };

  const handleSeal = (e) => {
    e.preventDefault();
    if (submitting) return;

    const validation = validateTreatForm(form);
    if (validation) {
      setErrors(validation);
      return;
    }

    setSubmit(true);
    if (soundEnabled) audioManager.playSeal();

    onUpdateParticipant({
      name:          form.name,
      chocolate:     form.chocolate,
      quantity:      form.quantity,
      signature:     form.signature,
      agreedPromise: form.agreedPromise,
    });

    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      setSubStep('sealed');
      setSubmit(false);
    }, 700);
  };

  const handleDone = () => {
    if (locked.current) return;
    locked.current = true;
    setExiting(true);
    setTimeout(onComplete, 800);
  };

  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className={`treat-scene ${exiting ? 'exiting' : ''}`}>

      {/* ── INTRO ── */}
      {subStep === 'intro' && (
        <div className="treat-intro">
          <span className="treat-icon" aria-hidden="true">🍫</span>
          <h1 className="treat-heading">The Easy Way Out</h1>
          <div className="divider-ember" />
          <p className="treat-body">You don't have to face the five levels.</p>
          <p className="treat-body">Just make one promise.</p>
          <button
            id="treat-continue-btn"
            className="btn btn-primary treat-btn"
            onClick={goToForm}
          >
            Make the Promise
          </button>
        </div>
      )}

      {/* ── FORM ── */}
      {subStep === 'form' && (
        <div className="treat-form-wrapper">
          <div className="treat-letter">
            <div className="letter-header">
              <p className="letter-eyebrow">Official Document</p>
              <h1 className="letter-title">🍫 Chocolate Promise</h1>
              <div className="divider-ember" />
            </div>

            <form className="letter-form" onSubmit={handleSeal} noValidate>
              <div className="letter-field">
                <label className="field-label" htmlFor="promise-name">Your Name</label>
                <input
                  id="promise-name"
                  type="text"
                  className="input"
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  placeholder="Full name..."
                  autoComplete="off"
                  maxLength={60}
                />
                {errors.name && <span className="error-text" role="alert">{errors.name}</span>}
              </div>

              <div className="letter-field">
                <label className="field-label" htmlFor="promise-choc">Chocolate</label>
                <input
                  id="promise-choc"
                  type="text"
                  className="input"
                  value={form.chocolate}
                  onChange={e => handleChange('chocolate', e.target.value)}
                  placeholder="e.g. Dairy Milk, KitKat, Ferrero..."
                  maxLength={60}
                />
                {errors.chocolate && <span className="error-text" role="alert">{errors.chocolate}</span>}
              </div>

              <div className="letter-field">
                <label className="field-label" htmlFor="promise-qty">Quantity</label>
                <input
                  id="promise-qty"
                  type="text"
                  className="input"
                  value={form.quantity}
                  onChange={e => handleChange('quantity', e.target.value)}
                  placeholder="e.g. 2 bars, 1 box..."
                  maxLength={40}
                />
                {errors.quantity && <span className="error-text" role="alert">{errors.quantity}</span>}
              </div>

              <div className="letter-field">
                <label className="field-label" htmlFor="promise-sig">E-Signature</label>
                <input
                  id="promise-sig"
                  type="text"
                  className="input"
                  value={form.signature}
                  onChange={e => handleChange('signature', e.target.value)}
                  placeholder="Sign here..."
                  autoComplete="off"
                  maxLength={60}
                />
                {errors.signature && <span className="error-text" role="alert">{errors.signature}</span>}
              </div>

              <div className="letter-check-row">
                <input
                  id="promise-agree"
                  type="checkbox"
                  className="letter-checkbox"
                  checked={form.agreedPromise}
                  onChange={e => handleChange('agreedPromise', e.target.checked)}
                />
                <label htmlFor="promise-agree" className="letter-check-label">
                  I promise to fulfill this chocolate promise to Nikhil.
                </label>
              </div>
              {errors.agreed && <span className="error-text" role="alert">{errors.agreed}</span>}

              <button
                id="promise-seal-btn"
                type="submit"
                className="btn btn-primary letter-seal-btn"
                disabled={submitting}
              >
                {submitting ? 'Sealing...' : 'Seal the Promise'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── SEALED ── */}
      {subStep === 'sealed' && (
        <div className="treat-sealed">
          <div className="seal-emblem" aria-hidden="true">🔒</div>
          <h1 className="sealed-title">Promise Sealed</h1>
          <div className="divider-ember" />

          <div className="sealed-card">
            <div className="sealed-row">
              <span className="sealed-label">Promised by</span>
              <span className="sealed-value">{form.name}</span>
            </div>
            <div className="sealed-row">
              <span className="sealed-label">Chocolate</span>
              <span className="sealed-value">{form.chocolate}</span>
            </div>
            <div className="sealed-row">
              <span className="sealed-label">Quantity</span>
              <span className="sealed-value">{form.quantity}</span>
            </div>
            <div className="sealed-row">
              <span className="sealed-label">Signed</span>
              <span className="sealed-value sealed-signature">{form.signature}</span>
            </div>
            <div className="sealed-row">
              <span className="sealed-label">For</span>
              <span className="sealed-value">Nikhil</span>
            </div>
            <div className="sealed-row">
              <span className="sealed-label">Date</span>
              <span className="sealed-value">{today}</span>
            </div>
          </div>

          <p className="sealed-wisdom">Wise decision.</p>

          <button
            id="treat-done-btn"
            className="btn btn-primary sealed-done-btn"
            onClick={handleDone}
          >
            View Promise
          </button>
        </div>
      )}
    </div>
  );
};

export default TreatRoute;
