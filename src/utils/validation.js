// ── Form validation utilities ──────────────────────────────────

export function validateName(name) {
  const t = name?.trim() ?? '';
  if (!t)          return 'A name is required.';
  if (t.length < 2) return 'Name must be at least 2 characters.';
  if (t.length > 60) return 'Name is too long.';
  return null;
}

export function validateAge(age) {
  const t = age?.trim() ?? '';
  if (!t)               return 'Age is required.';
  const n = parseInt(t, 10);
  if (isNaN(n))         return 'Please enter a number.';
  if (n < 1 || n > 120) return 'Please enter a valid age (1–120).';
  return null;
}

export function validateFear(fear) {
  const t = fear?.trim() ?? '';
  if (!t)          return 'Please write something.';
  if (t.length < 3) return 'Please be a little more specific.';
  return null;
}

export function validateTreatForm({ name, chocolate, quantity, signature, agreedPromise }) {
  const errors = {};
  if (!name?.trim())      errors.name      = 'Your name is required.';
  if (!chocolate?.trim()) errors.chocolate = 'Specify the chocolate.';
  if (!quantity?.trim())  errors.quantity  = 'Specify the quantity.';
  if (!signature?.trim()) errors.signature = 'Your signature is required.';
  if (!agreedPromise)     errors.agreed    = 'You must check the promise box.';
  return Object.keys(errors).length ? errors : null;
}
