import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/firebaseConfig';
import { doc, collection, query, where, onSnapshot, deleteDoc } from 'firebase/firestore';
import PostCard from '../components/PostCard';

function Profile() {
  const { user } = useAuth();
  const [myPosts, setMyPosts] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [myRSVPs, setMyRSVPs] = useState([]);

  const handleDelete = async (id, collectionName) => {
    const confirm = window.confirm("Are you sure you want to delete this?");
    if (!confirm) return;
  
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Could not delete.");
    }
  };
  

  useEffect(() => {
    if (!user) return;

    // My Posts
    const postQuery = query(
      collection(db, 'posts'),
      where('createdBy.uid', '==', user.uid)
    );
    const unsubPosts = onSnapshot(postQuery, snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMyPosts(data);
    });

    // My Events
    const eventQuery = query(
      collection(db, 'events'),
      where('createdBy.uid', '==', user.uid)
    );
    const unsubEvents = onSnapshot(eventQuery, snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMyEvents(data);
    });

    // My RSVPs
    const rsvpQuery = query(
      collection(db, 'events'),
      where('rsvps', 'array-contains', user.uid)
    );
    const unsubRSVPs = onSnapshot(rsvpQuery, snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMyRSVPs(data);
    });

    return () => {
      unsubPosts();
      unsubEvents();
      unsubRSVPs();
    };
  }, [user]);

  if (!user) return <p style={styles.center}>Please log in to view your profile.</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img src={user.photoURL} alt="avatar" style={styles.avatar} />
        <h2>{user.displayName}</h2>
        <p>{user.email}</p>
      </div>

      <div>
  <h3>📝 My Posts</h3>
  {myPosts.map(post => (
    <div key={post.id} style={{ marginBottom: '2rem' }}>
      <PostCard
        title={post.title}
        cause={post.cause}
        description={post.description}
        imageUrl={post.imageUrl}
        createdBy={post.createdBy}
        timestamp={post.createdAt?.toDate().toLocaleString()}
      />
      
      {post.createdBy?.uid === user?.uid && (
        <div>
          <button
            onClick={() => handleDelete(post.id, 'posts')}
            style={{
                backgroundColor: '#fff0f0',
                border: '1px solid #ffaaaa',
                color: '#a00',
                padding: '0.4rem 0.8rem',
                borderRadius: '999px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                marginTop: '0.5rem',
                marginLeft: 'auto',
                display: 'block'
            }}
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  ))}
</div>


<div>
  <h3>📅 My Events</h3>
  {myEvents.map(event => (
    <div key={event.id} style={{ marginBottom: '2rem' }}>
      <div style={styles.eventCard}>
        <h4>{event.title}</h4>
        <p><strong>📍</strong> {event.location}</p>
        <p><strong>📅</strong> {event.date}</p>
      </div>

      {event.createdBy?.uid === user?.uid && (
        <div>
          <button
            onClick={() => handleDelete(event.id, 'events')}
            style={{
                backgroundColor: '#fff0f0',
                border: '1px solid #ffaaaa',
                color: '#a00',
                padding: '0.4rem 0.8rem',
                borderRadius: '999px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                marginTop: '0.5rem',
                marginLeft: 'auto',
                display: 'block'
            }}
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  ))}
</div>


      <div>
        <h3>⭐ My RSVPs</h3>
        {myRSVPs.map(event => (
          <div key={event.id} style={styles.eventCard}>
            <h4>{event.title}</h4>
            <p><strong>📍</strong> {event.location}</p>
            <p><strong>📅</strong> {event.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: 'auto',
    padding: '1rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '0.5rem'
  },
  center: {
    textAlign: 'center',
    marginTop: '2rem',
  },
  eventCard: {
    backgroundColor: '#f9f9f9',
    padding: '1rem',
    margin: '0.5rem 0',
    borderRadius: '10px',
  }
};

export default Profile;
