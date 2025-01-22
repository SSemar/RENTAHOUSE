// frontend/src/App.jsx

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
//import SignupFormModal from './components/SignupFormModal/SignupFormModal';
import Navigation from './components/Navigation/Navigation';
//import Greeting from './components/OpenModalButton/Greeting';
//import LoginFormModal from './components/LoginFormModal/LoginFormModal';
import LandingPage from './components/LandingPage/LandingPage';
import LandingPage from './components/LandingPage';
import SpotDetailsPage from './components/SpotDetailsPage';
import UpdateSpotPage from './components/UpdateSpotPage';
import NewSpotPage from './components/NewSpotPage';
import SpotsPage from './components/ManageSpotsPage';
import * as sessionActions from './store/session';






function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
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
            element: <NewSpotPage />,
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
            {}
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