import React from 'react';

const Card = ({ text, img, video, onDelete }) => {
  const handleDelete = () => {
    onDelete(); // Call the onDelete prop function passed from the parent component
  };

  return (
    <div>
      <h3>{text}</h3>
      <img src={img} alt="Card" />
      <video controls>
        <source src={video} type="video/mp4" />
      </video>
      <button onClick={handleDelete}>Delete</button> {/* Delete button */}
    </div>
  );
};

export default Card;
