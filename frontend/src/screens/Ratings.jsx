import React, { useEffect, useState } from 'react';
import RatingsList from '../components/RatingsList';

export const Ratings = ({ game }) => {
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const fetchRatings = async () => {
      const { ratings } = await fetch(
        'http://localhost:3000/api/ratings'
      ).then((res) => res.json());

      setRatings(ratings);
    };

    fetchRatings();
    game.destroy(true);
  }, []);

  return (
    <React.Fragment>
      <h1>Ratings</h1>

      <RatingsList ratings={ratings} />
    </React.Fragment>
  );
};
