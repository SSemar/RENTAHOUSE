
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import { MdMenu } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';


const ProfileButton = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = e => {
    e.stopPropagation(); // Keep click from bubbling up to document & triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = e => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = e => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate('/');
  };

  const ulClassName = 'profile-dropdown' + (showMenu ? '' : ' hidden');
  const profileButtonClassName = 'profile-button' + (showMenu ? ' open' : '');

  return (
    <>
      <button onClick={toggleMenu} className={`${profileButtonClassName}`}>
        <MdMenu className="menu-icon" />
        <FaUserCircle className="profile-icon" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <div className="session-links">
            <li className="user-greeting">Hello, {user.firstName}</li>
            <li className="user-email">{user.email}</li>
            <Link to="/spots/current" className="dropdown-link">
              <li className="dropdown-item">Manage Spots</li>
            </Link>

            <button onClick={logout} className="dropdown-item logout-button">
              <li>Log Out</li>
            </button>
          </div>
        ) : (
          <div className="session-links">
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
          </div>
        )}
      </ul>
    </>
  );
};

export default ProfileButton;