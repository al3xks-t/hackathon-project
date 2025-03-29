import { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, onSnapshot, orderBy, query, doc, updateDoc, arrayUnion, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';


function MyEvents() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  
  const handleDelete = async (id) => {
          const confirm = window.confirm("Are you sure you want to delete this event?");
          if (!confirm) return;
        
          try {
            await deleteDoc(doc(db, 'events', id));
          } catch (err) {
            console.error("Error deleting event:", err);
            alert("Failed to delete event.");
          }
        };

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

  const handleRSVP = async (eventId, currentRsvps) => {
    if (!user) {
      alert("Please log in to RSVP.");
      return;
    }
  
    if (currentRsvps?.includes(user.uid)) {
      alert("You’ve already RSVP’d to this event!");
      return;
    }
  
    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, {
        rsvps: arrayUnion(user.uid)
      });
    } catch (error) {
      console.error("RSVP failed:", error);
    }
  };
  

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      <h2>Upcoming Events</h2>

        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1rem'
          }}
        />

{events
  .filter(event => {
    return (
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }).map(event => {
    const interestedCount = event.rsvps?.length || 0;
    const isGuest = !user;
    const hasRSVPed = user && event.rsvps?.includes(user.uid);
    const disableRSVP = isGuest || hasRSVPed;
    const isOwner = user && event.createdBy?.uid === user.uid;

    return (
        <div key={event.id} style={{ marginBottom: '2rem' }}>
        <div style={styles.card}>
          {event.imageUrl && (
            <img
              src={event.imageUrl}
              alt={event.title}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '250px',
                borderRadius: '10px',
                objectFit: 'cover',
                marginBottom: '0.75rem'
              }}
            />
          )}
      
          <h3>{event.title}</h3>
          <p><strong>Cause:</strong> {event.cause}</p>
          <p>{event.description}</p>
          <p><strong>📍 Location:</strong> {event.location}</p>
          <p><strong>📅 Date:</strong> {event.date}</p>
      
          <button
            style={{
              ...styles.rsvpBtn,
              backgroundColor: hasRSVPed ? '#ccc' : isGuest ? '#eee' : '#ffdaef',
              cursor: disableRSVP ? 'not-allowed' : 'pointer',
              color: disableRSVP ? '#999' : '#5b3a60'
            }}
            onClick={() => {
              if (isGuest) {
                alert("Please log in to RSVP.");
              } else {
                handleRSVP(event.id, event.rsvps);
              }
            }}
            disabled={disableRSVP}
          >
            {hasRSVPed
              ? "✔️ Interested"
              : isGuest
              ? "Login to RSVP"
              : "I'm Interested"}
          </button>
      
          <p style={styles.countText}>❤️ {interestedCount} interested</p>
        </div>
      
        {/* Delete button outside the card */}
        {event.createdBy?.uid === user?.uid && (
          <button
            onClick={() => handleDelete(event.id)}
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
        )}
      </div>
    );
  })}
        {events.filter(event =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase())
        ).length === 0 && (
          <p style={{ textAlign: 'center', color: '#888' }}>😔 No events match your search.</p>
        )}
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
  },
  rsvpBtn: {
    marginTop: '0.5rem',
    backgroundColor: '#ffdaef',
    border: 'none',
    borderRadius: '999px',
    padding: '0.5rem 1rem',
    fontWeight: 600,
    cursor: 'pointer',
    color: '#5b3a60',
    transition: 'all 0.2s ease-in-out',
  },
  countText: {
    fontSize: '0.85rem',
    color: '#5b3a60',
    marginTop: '0.25rem'
  },
};

export default MyEvents;
