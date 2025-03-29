import { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import PostCard from '../components/PostCard';
import { useAuth } from '../contexts/AuthContext';
import { doc, deleteDoc } from 'firebase/firestore';

const causes = ['All', 'Climate', 'Education', 'Health', 'Justice'];

function Home() {
  const [posts, setPosts] = useState([]);
  const [selectedCause, setSelectedCause] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this post?");
    if (!confirm) return;
  
    try {
      await deleteDoc(doc(db, 'posts', id));
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post.");
    }
  };

  useEffect(() => {
    setPosts([]); // clears post when filter changes
  
    let q = collection(db, 'posts');
    
    if (selectedCause !== 'All') {
      q = query(q, where('cause', '==', selectedCause), orderBy('createdAt', 'desc'));
    } else {
      q = query(q, orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postData);
    });
  
    return () => unsubscribe();
  }, [selectedCause]);
  
  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      <h2 align="center">Live Feed</h2>

      {/* Filter Buttons */}
      <div align="center" style={{ marginBottom: '1rem' }}>
        {causes.map(cause => (
          <button
            key={cause}
            onClick={() => setSelectedCause(cause)}
            style={{
              marginRight: '0.5rem',
              padding: '0.4rem 0.8rem',
              borderRadius: '20px',
              backgroundColor: selectedCause === cause ? '#333' : '#eee',
              color: selectedCause === cause ? '#fff' : '#333',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {cause}
          </button>
        ))}
      </div>
      <input
        type="text"
        placeholder="Search posts..."
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

      {/* Post Feed */}
      {posts.filter(post => {
      const matchesCause = selectedCause === 'All' || post.cause === selectedCause;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            post.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCause && matchesSearch;
    }).map(post => (
      <div key={post.id} style={{ position: 'relative' }}>
        <PostCard
          title={post.title}
          cause={post.cause}
          description={post.description}
          imageUrl={post.imageUrl}
          createdBy={post.createdBy}
          timestamp={post.createdAt?.toDate().toLocaleString()}
        />
        {post.createdBy?.uid === user?.uid && (
          <button
            onClick={() => handleDelete(post.id)}
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
    ))}
    </div>
  );
}

export default Home;
