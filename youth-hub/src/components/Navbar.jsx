import { NavLink } from 'react-router-dom';
import { auth, provider } from '../firebase/firebaseConfig';
import { signInWithPopup, signOut } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {

    const { user } = useAuth();

    const handleLogin = () => {
        signInWithPopup(auth, provider).catch((error) => {
          console.error('Login failed:', error);
        });
      };
      
      const handleLogout = () => {
        signOut(auth);
      };

    return (
      <nav style={styles.nav}>
        <NavLink to="/" style={styles.logo}>NextUp ⏫</NavLink>
        <div style={styles.linkGroup}>
            {user && (
              <>
                <NavLink to="/create-post" style={getLinkStyle}>📝 Create Post</NavLink>
                <NavLink to="/create-event" style={getLinkStyle}>📅 Create Event</NavLink>
              </>
            )}
          <NavLink to="/my-events" style={getLinkStyle}>⭐ Events</NavLink>
          <NavLink to="/profile" style={getLinkStyle}>👤 Profile</NavLink>
          {user ? ( <button onClick={handleLogout} style={styles.authBtn}>Logout</button> ) : ( <button onClick={handleLogin} style={styles.authBtn}>Login with Google</button> )}
        </div>
      </nav>
    );
  }
  
  const getLinkStyle = ({ isActive }) => ({
    ...styles.link,
    backgroundColor: isActive ? '#e0bbf5' : '#f6f0f8',
    fontWeight: isActive ? 600 : 500,
    transform: isActive ? 'scale(1.05)' : 'scale(1)',
  });

  const styles = {
    nav: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1rem 0 1.5rem 0',
      backgroundColor: '#ffedfb',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    },
    logo: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#5b3a60',
      textDecoration: 'none',
      marginBottom: '0.75rem',
    },
    linkGroup: {
      display: 'inline-flex',
      gap: '0.75rem',
      padding: '0.5rem 1rem',
      backgroundColor: '#fff',
      borderRadius: '999px',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
      border: '1px solid #e0d2e4',
    },
    link: {
      textDecoration: 'none',
      color: '#5b3a60',
      fontSize: '0.9rem',
      padding: '0.4rem 0.9rem',
      borderRadius: '999px',
      transition: 'all 0.2s ease-in-out',
    },
    authBtn: {
        backgroundColor: '#5b3a60',
        color: '#fff',
        padding: '0.4rem 0.8rem',
        border: 'none',
        borderRadius: '999px',
        cursor: 'pointer',
        marginLeft: '1rem'
    },      
  };
    

export default Navbar;
