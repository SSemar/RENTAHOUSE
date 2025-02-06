

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa6';
import SpotReview from './SpotReview.jsx';
import OpenModalButton from '../OpenModalButton';
import ReviewFormModal from '../ReviewFormModal';
import * as spotsActions from '../../store/spots';
import './SpotsDetailsPage.css';

//! spotDetailsPage
const SpotDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { spotId } = useParams();
  const user = useSelector(state => state.session.user);
  const allSpots = useSelector(state => state.spots.allSpots);
  const currentSpot = useSelector(state => state.spots.spot);
  const reviews = useSelector(state => state.spots.reviews);

  useEffect(() => {
    dispatch(spotsActions.clearStore());
    dispatch(spotsActions.getSpots());
    dispatch(spotsActions.getSpot(spotId));
    dispatch(spotsActions.getReviews(spotId));
  }, [dispatch, spotId]);

  if (allSpots && !allSpots.find(spot => spot.id === parseInt(spotId))) {
    return (
      <main className="spot-details-main">
        <h1 className="spot-details-header">Spot Not Found</h1>
        <button onClick={() => navigate('/')} className="return-home-button">
          Return to Home Page
        </button>
      </main>
    );
  }

  if (!allSpots || !currentSpot || !reviews) {
    return (
      <main className="spot-details-main">
        <h1 className="spot-details-header">Spots Detail Page Failed</h1>
      </main>
    );
  }

  const spot = {
    ...currentSpot,
    ...allSpots.find(spot => spot.id === parseInt(spotId)),
    reviews: reviews,
  };
  const spotAvgRating = spot.avgStarRating
    ? spot.avgStarRating.toFixed(2)
    : 'New';
  const previewImage = spot.previewImage;
  const otherImages = [];

  spot.SpotImages.forEach(image =>
    image.preview === false ? otherImages.push(image.url) : {}
  );

  let hasAlreadyReviewed;
  user
    ? (hasAlreadyReviewed = reviews.find(review => review.userId === user.id))
    : (hasAlreadyReviewed = false);

  let isNotOwner;
  user ? (isNotOwner = user.id !== spot.Owner.id) : (isNotOwner = false);

  return (
    <div className="spot-details-container">
      <main className="spot-details-main">
        <h1 className="spot-details-header">{spot.name}</h1>
        <h2 className="spot-details-location">
          {spot.city}, {spot.state}, {spot.country}
        </h2>
        <div className="spot-details-images">
          <img src={previewImage} className="spot-details-preview-image" />
          <span className="other-spot-details-images">
            {otherImages[0] && (
              <img
                src={otherImages[0]}
                className="spot-details-image top-left"
              />
            )}
            {otherImages[1] && (
              <img
                src={otherImages[1]}
                className="spot-details-image top-right"
              />
            )}
            {otherImages[2] && (
              <img
                src={otherImages[2]}
                className="spot-details-image bottom-left"
              />
            )}
            {otherImages[3] && (
              <img
                src={otherImages[3]}
                className="spot-details-image bottom-right"
              />
            )}
          </span>
        </div>
        <div className="spot-details-info-box">
          <div className="spot-details-info-box-line-1">
            <span className="spot-details-price">
              ${spot.price.toLocaleString()} night
            </span>
            <span className="spot-details-average-rating">
            
              <FaStar className="fa-star" />
              <span> {spotAvgRating}</span>
              <span hidden={!spot.avgStarRating}>
                {' '}
                · {spot.numReviews}{' '}
                {spot.numReviews === 1 ? 'review' : 'reviews'}
              </span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => alert('Feature Coming Soon...')}
            className="spot-details-reserve-button"
          >
            Reserve Spot
          </button>
        </div>
        <div className="bottom-spot-details">
          <h2 className="spot-details-host">
            Owned by {spot.Owner.firstName} {spot.Owner.lastName}
          </h2>
          <p className="spot-details-description">{spot.description}</p>
        </div>
        <div className="spot-details-reviews">
          <h2 className="spot-details-reviews-header">
            
            <FaStar className="fa-star-header" />
            <span> {spotAvgRating}</span>
            <span hidden={!spot.avgStarRating}>
              {' '}
              · {spot.numReviews} {spot.numReviews === 1 ? 'review' : 'reviews'}
            </span>
          </h2>
          {!!reviews.length && !!isNotOwner && !hasAlreadyReviewed && (
            <div className="post-review-button">
              <OpenModalButton
                modalComponent={<ReviewFormModal spotId={spotId} />}
                buttonText="Post Your Review"
              />
            </div>
          )}
          {!reviews.length && (
            <div className="spot-details-review-tagline">
              {!!isNotOwner && (
                <p className="spot-details-review-tagline-text">
                  Be the first to post a review!
                </p>
              )}
              <div className="post-review-button-no-reviews">
                {!!isNotOwner && (
                  <OpenModalButton
                    modalComponent={<ReviewFormModal spotId={spotId} />}
                    buttonText="Post Your Review"
                  />
                )}
              </div>
            </div>
          )}
          {[...reviews]
            .reverse()
            .map(review => SpotReview(review, user ? user.id : null, spotId))}
        </div>
      </main>
    </div>
  );
};

export default SpotDetailsPage;



// import React, { useEffect, useState } from 'react';
// import './Spots.css';

// const Spots = () => {
//   const [spots, setSpots] = useState([]);

//   useEffect(() => {
//     fetch('/api/spots/')
//       .then(response => response.json())
//       .then(data => setSpots(data))
//       .catch(error => console.error('Error fetching spots:', error));
//   }, []);

//   return (
//     <div className="spots-container">
//       {spots.map(spot => (
//         <div key={spot.id} className="spot-card">
//           <img src={spot.previewImage} alt={spot.name} className="spot-image" />
//           <h2>{spot.name}</h2>
//           <p>{spot.description}</p>
//           <p>{spot.price}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Spots;