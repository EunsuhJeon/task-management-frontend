import { useEffect, useState } from 'react';
import { createComment, deleteComment, listComments } from '../api/comments';
import { useAuth } from '../auth/AuthContext';

export default function TaskComments({ teamId, taskId, isAdmin }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await listComments(teamId, taskId);
        if (!cancelled) setComments(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [teamId, taskId]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const created = await createComment(teamId, taskId, content.trim());
      setComments((prev) => [...prev, created]);
      setContent('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(commentId) {
    try {
      await deleteComment(teamId, taskId, commentId);
      setComments((prev) => prev.filter((item) => item.id !== commentId));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="comments-panel">
      <h3>Comments</h3>
      {loading && <p className="muted small">Loading comments…</p>}
      {!loading && comments.length === 0 && <p className="muted small">No comments yet.</p>}

      <ul className="comment-list">
        {comments.map((comment) => {
          const canDelete = isAdmin || comment.author.id === user?.id;
          return (
            <li key={comment.id}>
              <div className="comment-head">
                <strong>{comment.author.name}</strong>
                <span className="muted small">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p>{comment.content}</p>
              {canDelete && (
                <button
                  type="button"
                  className="btn danger compact"
                  onClick={() => handleDelete(comment.id)}
                >
                  Delete
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <form className="comment-form" onSubmit={handleSubmit}>
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment…"
          maxLength={2000}
          required
        />
        <button className="btn primary compact" type="submit" disabled={submitting}>
          {submitting ? 'Posting…' : 'Post comment'}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}
    </section>
  );
}
