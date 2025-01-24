
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import AirbnbLogo from '../../images/AirbnbLogo.png';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  
  const { width } = useWindowDimensions();


  return (
    <ul className="nav-container">
      <li className="home-button">
        <NavLink to="/">
          <img
           src={width < 1128 ? AirbnbLogo : 'airbnb-logoLarge'}
           className='airbnb-logo'
          />
        </NavLink>
      </li>
      <div className="nav-right">
        {sessionUser && (
          <li>
            <NavLink to="/spots/new" className="create-spot-link">
              Create a New Spot
            </NavLink>
          </li>
        )}
        {isLoaded && (
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </div>
    </ul>
  );
}

export default Navigation;