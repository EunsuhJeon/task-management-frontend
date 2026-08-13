import { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { acceptInviteBody } from '../api/invites';
import { createTeam } from '../api/teams';

export default function OverviewPage() {
  const { teams, setTeams } = useOutletContext();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [inviteToken, setInviteToken] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joining, setJoining] = useState(false);

  async function handleCreate(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const team = await createTeam({ name, description });
      setTeams((prev) => [team, ...prev]);
      setName('');
      setDescription('');
      navigate(`/app/teams/${team.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleJoin(event) {
    event.preventDefault();
    setJoinError('');
    setJoining(true);
    try {
      const team = await acceptInviteBody(inviteToken.trim());
      setTeams((prev) => {
        const exists = prev.some((item) => item.id === team.id);
        return exists ? prev.map((item) => (item.id === team.id ? team : item)) : [team, ...prev];
      });
      setInviteToken('');
      navigate(`/app/teams/${team.id}`);
    } catch (err) {
      setJoinError(err.message);
    } finally {
      setJoining(false);
    }
  }

  return (
    <div className="stack">
      <section className="section">
        <h1>Overview</h1>
        <p className="muted">Create a team, join with an invite token, or open a board.</p>
      </section>

      <section className="section panel">
        <h2>Create team</h2>
        <form className="inline-form" onSubmit={handleCreate}>
          <label>
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              placeholder="Design squad"
            />
          </label>
          <label>
            Description
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              placeholder="Optional"
            />
          </label>
          <button className="btn primary" type="submit" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create'}
          </button>
        </form>
        {error && <p className="error-text">{error}</p>}
      </section>

      <section className="section panel">
        <h2>Join with invite</h2>
        <form className="inline-form" onSubmit={handleJoin}>
          <label>
            Invite token
            <input
              value={inviteToken}
              onChange={(e) => setInviteToken(e.target.value)}
              required
              placeholder="Paste token from invite link"
            />
          </label>
          <button className="btn ghost" type="submit" disabled={joining}>
            {joining ? 'Joining…' : 'Join team'}
          </button>
        </form>
        {joinError && <p className="error-text">{joinError}</p>}
      </section>

      <section className="section">
        <h2>Your teams</h2>
        {teams.length === 0 ? (
          <p className="muted">No teams yet. Create one above.</p>
        ) : (
          <ul className="team-list">
            {teams.map((team) => (
              <li key={team.id}>
                <Link to={`/app/teams/${team.id}`}>
                  <strong>{team.name}</strong>
                  <span className="muted">{team.myRole}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
