import { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import PostCard from '../components/PostCard';

const causes = ['All', 'Climate', 'Education', 'Health', 'Justice'];

function Home() {
  const [posts, setPosts] = useState([]);
  const [selectedCause, setSelectedCause] = useState('All');

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

      {/* Post Feed */}
      {posts.map(post => (
        <PostCard
          key={post.id}
          title={post.title}
          cause={post.cause}
          description={post.description}
          imageUrl={post.imageUrl}
          timestamp={post.createdAt?.toDate().toLocaleString()}
        />
      ))}
    </div>
  );
}

export default Home;
