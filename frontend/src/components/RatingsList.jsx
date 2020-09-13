import React from 'react';

const RatingsList = ({ ratings }) => {
  return (
    <ul>
      {ratings.map((rating) => (
        <li key={rating._id}>
          Name: {rating.name}, score: {rating.rating}
        </li>
      ))}
    </ul>
  );
};

export default RatingsList;
