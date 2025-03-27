import { NavLink } from 'react-router-dom';


function Navbar() {
    return (
      <nav style={styles.nav}>
        <NavLink to="/" style={styles.logo}>YouthHub</NavLink>
        <div style={styles.linkGroup}>
          <NavLink to="/create-post" style={getLinkStyle}>📝 Create Post</NavLink>
          <NavLink to="/create-event" style={getLinkStyle}>📅 Create Event</NavLink>
          <NavLink to="/my-events" style={getLinkStyle}>⭐ My Events</NavLink>
          <NavLink to="/profile" style={getLinkStyle}>👤 Profile</NavLink>
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
  };
    

export default Navbar;
