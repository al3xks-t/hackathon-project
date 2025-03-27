import { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

function MyEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      <h2>Upcoming Events</h2>
      {events.map(event => (
        <div key={event.id} style={styles.card}>
          <h3>{event.title}</h3>
          <p><strong>Cause:</strong> {event.cause}</p>
          <p>{event.description}</p>
          <p><strong>📍 Location:</strong> {event.location}</p>
          <p><strong>📅 Date:</strong> {event.date}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    border: '1px solid #ccc',
    borderRadius: '12px',
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
  }
};

export default MyEvents;
