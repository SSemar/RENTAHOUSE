

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LandingSpot from './LandingSpot';
import * as spotsActions from '../../store/spots';
import './LandingPage.css';

const LandingPage = () => {
  const dispatch = useDispatch();
  const spots = useSelector(state => state.spots.allSpots);

  useEffect(() => {
    dispatch(spotsActions.getSpots());
  }, [dispatch]);

  if (!spots)
    return (
      <main className="spot-details-main">
        <h1 className="spot-details-header">No Spots Loaded...</h1>
      </main>
    );

    return (
      <>
        <main className="landing-page-spots-main">
          <div className="landing-page-spots-main-div">
            {spots.map(spot => LandingSpot(spot))}
          </div>
        </main>
      </>
    );
  };
//   return (
//     <>
//       <main className="landing-page-spots-main">
//         {spots.map(spot => ( LandingSpot(spot) ))}
//       </main>
//     </>
//   );
// };

export default LandingPage;