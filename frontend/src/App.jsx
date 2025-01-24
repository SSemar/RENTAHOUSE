// frontend/src/App.jsx

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import LandingPage from './components/LandingPage';
import SpotDetailsPage from './components/SpotsDetailsPage';
import UpdateSpotPage from './components/UpdateSpotPage';
import NewSpot from './components/NewSpot';
import SpotsPage from './components/SpotsPage';
import * as sessionActions from './store/session';
//import SignupFormModal from './components/SignupFormModal/SignupFormModal';
//import LoginFormModal from './components/LoginFormModal/LoginFormModal';



const Layout = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/spots',
        children: [
          {
            path: ':spotId',
            element: <SpotDetailsPage />,
          },
          {
            path: ':spotId/edit',
            element: <UpdateSpotPage />,
          },
          {
            path: 'new',
            element: <NewSpot />,
          },
          {
            path: 'current',
            element: <SpotsPage />,
          },
        ],
      },
      {
        path: '*',
        element: (
          <main>
            <h1>Page Not Found</h1>
            {/* <button
              onClick={() => navigate('/')}
              className="return-home-button"
            >
              Return to Home Page
            </button> */}
          </main>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;