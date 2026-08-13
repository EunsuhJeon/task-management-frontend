import { useEffect, useState } from 'react';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { acceptInvite } from '../api/invites';

export default function InviteAcceptPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setTeams } = useOutletContext();
  const [status, setStatus] = useState('joining');
  const [error, setError] = useState('');
  const [teamName, setTeamName] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function join() {
      try {
        const team = await acceptInvite(token);
        if (cancelled) return;
        setTeamName(team.name);
        setTeams((prev) => {
          const exists = prev.some((item) => item.id === team.id);
          return exists ? prev.map((item) => (item.id === team.id ? team : item)) : [team, ...prev];
        });
        setStatus('done');
        setTimeout(() => navigate(`/app/teams/${team.id}`, { replace: true }), 800);
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setStatus('error');
        }
      }
    }

    join();
    return () => {
      cancelled = true;
    };
  }, [token, navigate, setTeams]);

  return (
    <div className="stack">
      <section className="section panel">
        <h1>Join team</h1>
        {status === 'joining' && <p className="muted">Accepting invite…</p>}
        {status === 'done' && (
          <p>
            Joined <strong>{teamName}</strong>. Redirecting to the board…
          </p>
        )}
        {status === 'error' && (
          <>
            <p className="error-text">{error}</p>
            <Link to="/app">Back to overview</Link>
          </>
        )}
      </section>
    </div>
  );
}
