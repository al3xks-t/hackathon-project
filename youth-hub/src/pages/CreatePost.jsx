import { useEffect, useState } from 'react';
import { app } from '../firebase/firebaseConfig';
import { db, storage } from '../firebase/firebaseConfig';
import { collection, addDoc, Timestamp, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid'; // for unique file names
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


function CreatePost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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
  
      // upload image to firebase storage if it exists
      if (image) {
        const imageRef = ref(storage, `postImages/${uuidv4()}-${image.name}`);
        const uploadResult = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(uploadResult.ref);
      }
      
      // save post to firestore
      await addDoc(collection(db, 'posts'), {
        title,
        description,
        cause,
        imageUrl,
        createdAt: Timestamp.now(),
        createdBy: {
          uid: user?.uid || 'anon',
          displayName: user?.displayName || 'Anonymous',
          email: user?.email || 'no-email',
        }
      });
  
      alert('Post submitted!');
      setTitle('');
      setDescription('');
      setCause('');
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error("Error submitting post with image:", error);
      alert("Something went wrong. Try again!");
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={styles.input}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={styles.textarea}
        />

        <input type="file" accept="image/*" onChange={handleImageChange} style={styles.input} />
        {preview && <img src={preview} alt="preview" style={styles.preview} />}

        <select
          value={cause}
          onChange={(e) => setCause(e.target.value)}
          required
          style={styles.input}
        >
          <option value="">Select Cause</option>
          <option value="Climate">Climate</option>
          <option value="Education">Education</option>
          <option value="Health">Health</option>
          <option value="Justice">Justice</option>
          <option value="Other">Other</option>
        </select>

        <button type="submit" style={styles.button}>Submit</button>
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
  textarea: {
    display: 'block',
    width: '100%',
    height: '100px',
    marginBottom: '1rem',
    padding: '0.5rem',
    fontSize: '1rem',
  },
  preview: {
    width: '100%',
    marginBottom: '1rem',
    borderRadius: '8px',
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

export default CreatePost;
