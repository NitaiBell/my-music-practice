import { useState, useEffect } from 'react';
import './PasswordGateServer.css';

export default function PasswordGateServer({ children }) {
  const [accessGranted, setAccessGranted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const hasAccess = localStorage.getItem('access_granted') === 'true';
    setAccessGranted(hasAccess);
    setLoading(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/check-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('access_granted', 'true');
        setAccessGranted(true);
        window.location.href = '/signup'; // ✅ הפניה פשוטה
      } else {
        setError('❌ Wrong or used password');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('⚠️ Server error. Please try again later.');
    }
  };

  if (loading) return null;

  if (accessGranted) return children;

  return (
    <div className="password-gate-container">
      <div className="password-gate-box">
        <h2>🔒 Access Restricted</h2>
        <p>Enter your one-time password to continue</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="password-gate-input"
          />
          <br />
          <button type="submit" className="password-gate-button">
            Enter
          </button>
        </form>
        {error && <div className="password-error">{error}</div>}
      </div>
    </div>
  );
}
