import './BookingsPage.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as bookingsActions from '../../store/bookings';

//! fix this booking page? maybe has to have (state => state.bookings.allBookings); 
// figure out the structure of the bookings reducer
const BookingsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(() => {
        dispatch(bookingsActions.getBookings());
        }, [dispatch]);
    };
    //! fix this
    return (
        <main className="bookings-main">
            <h1>Manage Bookings</h1>
        </main>
    );
