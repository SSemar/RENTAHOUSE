import './BookingsPage.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as bookingsActions from '../../store/bookings';
import { use } from 'react';

const BookingsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(() => {
        dispatch(bookingsActions.getBookings());
        }, [dispatch]);
        
    };