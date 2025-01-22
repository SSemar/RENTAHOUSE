// frontend/src/components/Navigation/Navigation.jsx

import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  

  return (
    <ul className="nav-container">
      <li className="home-button">
        <NavLink to="/">
          <img
           src = "airbnb-logo.png"
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