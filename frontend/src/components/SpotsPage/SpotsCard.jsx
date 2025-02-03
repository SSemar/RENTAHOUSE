
import { NavLink, Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa6';
import OpenModalButton from '../OpenModalButton';
import DeleteModal from '../DeleteModal';

const SpotsCard = spot => {
  const spotAvgRating = spot.avgRating ? spot.avgRating.toFixed(2) : 'New';
  const previewImage = spot.previewImage;

  return (
    <NavLink
      to={`/spots/${spot.id}`}
      className="spots-page-spot-card-link"
      key={spot.id}
    >
      <div className="spots-page-spot-card-div">
        <img
          src={previewImage}
          title={spot.name}
          alt={spot.name}
          className="spots-page-spot-card-preview-image"
        />
        <div className="spots-page-spot-card-line-1">
          <span className="spots-page-spot-card-location">
            {spot.city}, {spot.state}
          </span>
          <span className="spots-page-spot-card-average-rating">
            <FaStar className="spots-page-spot-card-fa-star" />
            &nbsp;{spotAvgRating}
          </span>
        </div>
        <div className="spots-page-spot-card-line-2">
          <b>${spot.price.toLocaleString()}</b> night
        </div>
        <div className="spots-page-spot-card-line-3">
          <Link
            to={`/spots/${spot.id}/edit`}
            state={{ spot }}
            className="update-spot-button"
          >
            Update
          </Link>
          <button
            className="delete-spot-button"
            onClick={e => e.preventDefault()}
          >
            <OpenModalButton
              modalComponent={
                <DeleteModal type="spot" spotId={spot.id} />
              }
              buttonText="Delete"
            />
          </button>
        </div>
      </div>
    </NavLink>
  );
};

export default SpotsCard;