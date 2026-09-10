import { useState } from 'react';
import { Lock } from 'lucide-react';
import AdminPanel from '../../sections/AdminPanel';
import { isAdminUnlocked, unlockAdmin, lockAdmin, verifyPassword } from '../../lib/adminAuth';
import './AdminGate.css';

export default function AdminGate() {
  const [unlocked, setUnlocked] = useState(isAdminUnlocked);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async e => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const ok = await verifyPassword(password);
      if (!ok) {
        setError('Incorrect password. Try again.');
        setPassword('');
        return;
      }
      unlockAdmin();
      setUnlocked(true);
      setPassword('');
    } catch {
      setError('Unable to verify in this browser.');
    } finally {
      setBusy(false);
    }
  };

  const goHome = () => { window.location.href = '/'; };
  const logout = () => { lockAdmin(); setUnlocked(false); };

  if (unlocked) {
    return <AdminPanel onClose={goHome} onLock={logout} />;
  }

  return (
    <div className="gate-screen">
      <div className="gate-card" data-testid="admin-gate">
        <div className="gate-icon"><Lock size={22} /></div>
        <h1 className="gate-title">Azumi Control</h1>
        <p className="gate-sub">Enter the password to manage site content.</p>
        <form onSubmit={submit} className="gate-form">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            autoFocus
            required
            data-testid="admin-password-input"
          />
          {error && <p className="gate-error" data-testid="admin-gate-error">{error}</p>}
          <button type="submit" className="btn btn-primary gate-submit" disabled={busy} data-testid="admin-unlock-btn">
            {busy ? 'Checking…' : 'Unlock'}
          </button>
        </form>
        <a href="/" className="gate-back">← Back to site</a>
      </div>
    </div>
  );
}
