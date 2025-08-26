import { useEffect, useState } from "react";
import axiosInstance from "../../../AxiosInstance";
// Reuse notification styles from notification feature
import "../../notification/styles/Notification.css";

export default function CheckActivity() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get('/notification/activity', { params: { page, limit: 20 } });
        if (page === 1) setItems(res.data.items || []);
        else setItems((prev) => [...prev, ...(res.data.items || [])]);
        setHasMore(res.data.hasMore);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  if (loading) return <div className="notify-container">Loading...</div>;

  return (
    <div className="notify-container" style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 760 }}>
        <h2 style={{ marginBottom: 12, textAlign: 'center' }}>Your Activity</h2>
        {items.length === 0 && <p style={{ textAlign: 'center' }}>No recent activity.</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {items.map((it, idx) => (
            <div
              key={idx}
              className="notification-card"
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                background: it.type === 'like' ? '#fff1f2' : it.type === 'post' ? '#f0f9ff' : '#f0fdf4',
                borderColor: it.type === 'like' ? '#ffe4e6' : it.type === 'post' ? '#e0f2fe' : '#dcfce7'
              }}
            >
            {it.type === 'like' && it.data.owner && (
              <img
                src={`http://localhost:8080${it.data.owner.image || ''}`}
                alt={it.data.owner.username}
                style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
              />
            )}
            <div style={{ flex: 1 }}>
              {it.type === 'post' && (
                <p style={{ margin: 0 }}>You posted{it.data.caption ? `: ${it.data.caption}` : ''}</p>
              )}
              {it.type === 'like' && (
                <p style={{ margin: 0 }}>
                  You liked {it.data.owner?.username ? <strong>{it.data.owner.username}</strong> : 'a user'}'s post{it.data.caption ? `: ${it.data.caption}` : ''}
                </p>
              )}
              {it.type === 'follow' && (
                <p style={{ margin: 0 }}>You followed <strong>{it.data.username}</strong></p>
              )}
              <span style={{ color: '#777', fontSize: 12 }}>{new Date(it.createdAt).toLocaleString()}</span>
            </div>
            {it.data?.imagePath && (
              <img alt="post" src={`http://localhost:8080${it.data.imagePath}`} style={{ width: 90, height: 60, objectFit: 'cover', borderRadius: 8 }} />
            )}
            </div>
          ))}
          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <button className="load-more-btn" onClick={() => setPage((p) => p + 1)}>Load More</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


