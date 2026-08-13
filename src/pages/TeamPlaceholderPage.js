import { Link, useParams } from 'react-router-dom';

export default function TeamPlaceholderPage() {
  const { teamId } = useParams();

  return (
    <div className="stack">
      <section className="section">
        <p className="muted">
          <Link to="/app">← Overview</Link>
        </p>
        <h1>Team #{teamId}</h1>
        <p className="muted">
          Team board and tasks come in Phase 4. Auth, routing, and API wiring are ready.
        </p>
      </section>
    </div>
  );
}
