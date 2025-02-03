


import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SpotsCard from './SpotsCard';
import * as spotsActions from '../../store/spots';
import './SpotsPage.css';

const SpotsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector(state => state.session.user).id;
  const allSpots = useSelector(state => state.spots.allSpots);

  useEffect(() => {
    dispatch(spotsActions.getSpots());
  }, [dispatch]);

  if (!allSpots)
    return (
      <main className="spots-main">
        <h1>Loading page...</h1>
      </main>
    );

  const spots = allSpots.filter(spot => spot.ownerId === userId);

  if (!spots)
    return (
      <main className="spot-details-main">
        <h1 className="spot-details-header">Loading page...</h1>
      </main>
    );

  return (
    <>
      <main className="spots-page-main">
        <h1 className="spots-page-h1">Manage Spots</h1>
        {!!spots.length && (
          <button
            onClick={() => navigate('/spots/new')}
            className="create-spot-button"
          >
            Create a New Spot!
          </button>
        )}
        {!spots.length && (
          <div className="spots-page-tagline">
            <p className="spots-page-tagline-text">
              Create your spot!
            </p>
            <button
              onClick={() => navigate('/spots/new')}
              className="create-spot-button-no-spots"
            >
              Create a New Spot
            </button>
          </div>
        )}
        <div className="spots-page-spots">
          {spots.map(spot => SpotsCard(spot, navigate))}
        </div>
      </main>
    </>
  );
};

export default SpotsPage;