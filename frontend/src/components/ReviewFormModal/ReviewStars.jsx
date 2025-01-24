// frontend/src/components/ReviewFormModal/ReviewStarsInput.jsx
import { FaStar } from 'react-icons/fa6';
import { useState, useEffect } from 'react';

const ReviewStars = ({ onChange, stars, disabled }) => {
  const [activeStars, setActiveStars] = useState(stars);

  useEffect(() => setActiveStars(stars), [stars]);

  const renderStars = () => {
    const starsArr = [];

    for (let i = 1; i < 6; i++) {
      starsArr.push(
        <div
          className={
            activeStars >= i ? 'review-star filled' : 'review-star empty'
          }
          onMouseEnter={() => !disabled && setActiveStars(i)}
          onMouseLeave={() => setActiveStars(stars)}
          onClick={() => onChange(i)}
          key={i}
        >
          <FaStar />
        </div>
      );
    }

    return starsArr;
  };

  return <div className="review-input review-stars">{renderStars()}</div>;
};

export default ReviewStars;