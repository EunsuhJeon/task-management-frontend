import { NavLink, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { listMyTeams } from '../api/teams';
import { useAuth } from '../auth/AuthContext';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadTeams() {
      try {
        const data = await listMyTeams();
        if (!cancelled) setTeams(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    }

    loadTeams();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">TM</span>
          <div>
            <p className="brand-name">Taskflow</p>
            <p className="brand-sub">Team tasks</p>
          </div>
        </div>

        <nav className="side-nav">
          <p className="nav-label">Workspace</p>
          <NavLink to="/app" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Overview
          </NavLink>

          <p className="nav-label">Teams</p>
          {error && <p className="error-text">{error}</p>}
          {teams.length === 0 && !error && <p className="muted small">No teams yet</p>}
          {teams.map((team) => (
            <NavLink
              key={team.id}
              to={`/app/teams/${team.id}`}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <span>{team.name}</span>
              <span className="role-chip">{team.myRole}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main-pane">
        <header className="topbar">
          <div>
            <p className="topbar-kicker">Signed in</p>
            <p className="topbar-user">{user?.name}</p>
          </div>
          <div className="topbar-actions">
            <span className="muted small">{user?.email}</span>
            <button type="button" className="btn ghost" onClick={logout}>
              Log out
            </button>
          </div>
        </header>
        <main className="content">
          <Outlet context={{ teams, setTeams }} />
        </main>
      </div>
    </div>
  );
}
