
import { NavLink } from 'react-router-dom';
import { FaRegStar } from "react-icons/fa";

const LandingSpot = spot => {
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
            <FaRegStar className="landing-page-spot-card-fa-reg-star" />
            &nbsp;{spotAvgRating}
          </span>
        </div>
        <div className="landing-page-spot-card-line-2">
          <b>${spot.price.toLocaleString()}</b> Per Night
        </div>
      </div>
    </NavLink>
  );
};

export default LandingSpot;