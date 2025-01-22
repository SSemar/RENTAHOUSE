// frontend/src/components/LandingPage/LandingPageSpotCard.jsx
import { NavLink } from 'react-router-dom';
import { FaStar } from 'react-icons/fa6';

const LandingPageSpotCard = spot => {
  const spotAvgRating = spot.avgRating ? spot.avgRating.toFixed(2) : 'New';
  const previewImage = spot.previewImage;

  return (
    <NavLink
      to={`/spots/${spot.id}`}
      className="landing-page-spot-card-link"
      key={spot.id}
    >
      <div className="landing-page-spot-card-div">
        <img
          src={previewImage}
          title={spot.name}
          alt={spot.name}
          className="landing-page-spot-card-preview-image"
        />
        <div className="landing-page-spot-card-line-1">
          <span className="landing-page-spot-card-location">
            {spot.city}, {spot.state}
          </span>
          <span className="landing-page-spot-card-average-rating">
            <FaStar className="landing-page-spot-card-fa-star" />
            &nbsp;{spotAvgRating}
          </span>
        </div>
        <div className="landing-page-spot-card-line-2">
          <b>${spot.price.toLocaleString()}</b> night
        </div>
      </div>
    </NavLink>
  );
};

export default LandingPageSpotCard;