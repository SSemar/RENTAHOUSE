

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import ReviewStars from './ReviewStars';
import * as spotsActions from '../../store/spots';
import './ReviewForm.css';

const ReviewFormModal = ({ spotId }) => {
  const dispatch = useDispatch();
  const [reviewText, setReviewText] = useState('');
  const [reviewStars, setReviewStars] = useState(0);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const isReviewButtonDisabled = reviewText.length < 10 || reviewStars < 1;

  const handleSubmit = e => {
    e.preventDefault();
    setErrors({});
    return dispatch(
      spotsActions.postReview(spotId, {
        review: reviewText,
        stars: reviewStars,
      })
    )
      .then(closeModal)
      .catch(async res => {
        const data = await res.json();
        if (data?.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <main className="review-form-main">
      <h1 className="review-h1">How was your experience?</h1>
      {errors.review && <p className="review-error">{errors.review}</p>}
      {errors.stars && <p className="review-error">{errors.stars}</p>}
      <form onSubmit={handleSubmit} className="review-form">
        <label className="review-label">
          <textarea
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            placeholder="Leave your review here..."
            required
            className="review-"
          />
        </label>
        <label className="review-label-stars">
          <ReviewStars
            onChange={number => setReviewStars(number)}
            stars={reviewStars}
            disabled={false}
          />
          <span className="stars-text">&nbsp;Stars</span>
        </label>
        <button
          type="submit"
          disabled={isReviewButtonDisabled}
          className="review-button"
        >
          Submit Your Review
        </button>
      </form>
    </main>
  );
};



export default ReviewFormModal;