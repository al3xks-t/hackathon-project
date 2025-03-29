import { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, Timestamp, deleteDoc } from 'firebase/firestore';
import { storage } from '../firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid'; 
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


function CreateEvent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [cause, setCause] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (!user) {
      alert("You must be logged in to create content.");
      navigate('/');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        let imageUrl = '';

        if (image) {
          const imageRef = ref(storage, `eventImages/${uuidv4()}-${image.name}`);
          const uploadResult = await uploadBytes(imageRef, image);
          imageUrl = await getDownloadURL(uploadResult.ref);
        }
      await addDoc(collection(db, 'events'), {
        title,
        description,
        date,
        location,
        cause,
        imageUrl,
        createdAt: Timestamp.now(),
        createdBy: {
            uid: user?.uid || 'anon',
            displayName: user?.displayName || 'Anonymous',
            email: user?.email || 'no-email',
        }
      });
      alert('Event submitted!');
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      setImage(null);
      setPreview(null);
      setCause('');
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to submit event.");
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={styles.input} />

        <textarea placeholder="Event Description" value={description} onChange={(e) => setDescription(e.target.value)} required style={styles.textarea} />
        
        <input type="file" accept="image/*" onChange={handleImageChange} style={styles.input} />
        {preview && <img src={preview} alt="preview" style={styles.preview} />}

        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={styles.input} />

        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required style={styles.input} />

        <select value={cause} onChange={(e) => setCause(e.target.value)} required style={styles.input}>
          <option value="">Select Cause</option>
          <option value="Climate">Climate</option>
          <option value="Education">Education</option>
          <option value="Health">Health</option>
          <option value="Justice">Justice</option>
        </select>

        <button type="submit" style={styles.button}>Submit Event</button>
      </form>
    </div>
  );
}

const styles = {
  input: {
    display: 'block',
    width: '100%',
    marginBottom: '1rem',
    padding: '0.5rem',
    fontSize: '1rem',
  },
  preview: {
    width: '100%',
    marginBottom: '1rem',
    borderRadius: '8px',
  },
  textarea: {
    display: 'block',
    width: '100%',
    height: '100px',
    marginBottom: '1rem',
    padding: '0.5rem',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem',
    width: '100%',
    fontSize: '1rem',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default CreateEvent;
