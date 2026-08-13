import { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { createTeam } from '../api/teams';

export default function OverviewPage() {
  const { teams, setTeams } = useOutletContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const team = await createTeam({ name, description });
      setTeams((prev) => [team, ...prev]);
      setName('');
      setDescription('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="stack">
      <section className="section">
        <h1>Overview</h1>
        <p className="muted">Create a team or open one from the sidebar.</p>
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
