import { useState } from 'react';
import { updateMe } from '../api/auth';
import { useAuth } from '../auth/AuthContext';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);
    try {
      const updated = await updateMe({ name });
      setUser(updated);
      setMessage('Profile updated.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="stack">
      <section className="section">
        <h1>Profile</h1>
        <p className="muted">Update how your name appears to teammates.</p>
      </section>

      <section className="section panel">
        <form className="inline-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input value={user?.email || ''} disabled />
          </label>
          <label>
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={50}
            />
          </label>
          <button className="btn primary" type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save profile'}
          </button>
        </form>
        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}
      </section>
    </div>
  );
}
