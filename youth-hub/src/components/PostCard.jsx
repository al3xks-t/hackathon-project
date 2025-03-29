
function PostCard({ title, cause, description, imageUrl, timestamp, createdBy }) {

    return (
      <div style={styles.card}>
        {imageUrl && <img src={imageUrl} alt={title} style={styles.image} />}
        <div style={styles.content}>
          <h3>{title}</h3>
          <p><strong>Cause:</strong> {cause}</p>
          <p>{description}</p>
          <p style={styles.timestamp}>{timestamp || "Just now"}</p>
          {createdBy?.displayName && (
              <p style={{ fontSize: '0.85rem', color: '#666' }}>
                👤 Created by: {createdBy.displayName}
              </p>
            )}
        </div>
      </div>
    );
  }
  
  const styles = {
    card: {
      border: '1px solid #ccc',
      borderRadius: '12px',
      margin: '1rem 0',
      padding: '1rem',
      maxWidth: '500px',
      backgroundColor: '#f9f9f9',
    },
    image: {
      width: '100%',
      height: 'auto',          
      borderRadius: '8px',
      objectFit: 'cover',      
      marginBottom: '0.5rem',
      maxHeight: '300px', 
    },
    content: {
      textAlign: 'left',
    },
    timestamp: {
      fontSize: '0.8rem',
      color: '#666',
    }
  };
  
  export default PostCard;
  