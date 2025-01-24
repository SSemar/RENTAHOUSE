// frontend/src/components/UpdateSpotPage/UpdateSpotPage.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import * as spotsActions from '../../store/spots';
import './UpdateSpotPage.css';

const UpdateSpotPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { spotId } = useParams();
  const spot = location.state?.spot;
  const [country, setCountry] = useState(spot.country);
  const [address, setAddress] = useState(spot.address);
  const [city, setCity] = useState(spot.city);
  const [state, setState] = useState(spot.state);
  const [lat, setLat] = useState(spot.lat);
  const [lng, setLng] = useState(spot.lng);
  const [description, setDescription] = useState(spot.description);
  const [name, setName] = useState(spot.name);
  const [price, setPrice] = useState(spot.price);
  const [errors, setErrors] = useState({});
  const isUpdateSpotButtonDisabled = Object.keys(errors).length;

  useEffect(() => {
    dispatch(spotsActions.getSpot(spotId));
  }, [dispatch, spotId]);

  useEffect(() => {
    const effectErrors = {};

    if (!country.length) effectErrors.country = 'Country is required';
    if (!address.length) effectErrors.address = 'Address is required';
    if (!city.length) effectErrors.city = 'City is required';
    if (!state.length) effectErrors.state = 'State is required';
    if (!lat) effectErrors.lat = 'Latitude is required';
    if (!lng) effectErrors.lng = 'Longitude is required';
    if (!description.length)
      effectErrors.description = 'Description is required';
    if (!name.length) effectErrors.name = 'Name is required';
    if (!price) effectErrors.price = 'Price is required';

    setErrors(effectErrors);
  }, [country, address, city, state, lat, lng, description, name, price]);

  if (!Object.keys(spot).length) {
    return (
      <main className="spot-details-main">
        <h1 className="spot-details-header">Loading page...</h1>
      </main>
    );
  }

  const handleSubmit = e => {
    e.preventDefault();

    if (description.length > 29) {
      setErrors({});

      dispatch(
        spotsActions.putSpot({
          spotId,
          address,
          city,
          state,
          country,
          lat,
          lng,
          name,
          description,
          price,
        })
      )
        .catch(async res => {
          const data = await res.json();
          // Equivalent to `if (data && data.errors) {`
          if (data?.errors) {
            setErrors(data.errors);
          }
        })
        .then(() => {
          navigate(`/spots/${spotId}`);
        });
    } else {
      const validationErrors = {};

      if (description.length < 30)
        validationErrors.description =
          'Description must be at least 30 characters';

      return setErrors(validationErrors);
    }
  };

  return (
    <main className="update-spot-main">
      <form onSubmit={handleSubmit} className="update-spot-form">
        <h1 className="update-spot-h1">Update Your Spot</h1>
        <div className="update-spot-form-section">
          <h2 className="update-spot-h2">Where&apos;s your place located?</h2>
          <p className="update-spot-p">
            Guests will only get your exact address once they have booked a
            reservation.
          </p>
          <label className="update-spot-label">
            Country&nbsp;
            {errors.country && (
              <p className="update-spot-error-inline">{errors.country}</p>
            )}
            <input
              type="text"
              value={country}
              onChange={e => setCountry(e.target.value)}
              placeholder="Country"
              className="update-spot-input"
            />
          </label>
          <label className="update-spot-label">
            Street Address&nbsp;
            {errors.address && (
              <p className="update-spot-error-inline">{errors.address}</p>
            )}
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Street Address"
              className="update-spot-input"
            />
          </label>
          <div className="update-spot-div">
            <div className="update-spot-input-inline-grid">
              <label className="update-spot-label">
                City&nbsp;
                {errors.city && (
                  <p className="update-spot-error-inline">{errors.city}</p>
                )}
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="City"
                  className="update-spot-input"
                />
              </label>
              ,&nbsp;
              <label className="update-spot-label">
                State&nbsp;
                {errors.state && (
                  <p className="update-spot-error-inline">{errors.state}</p>
                )}
                <input
                  type="text"
                  value={state}
                  onChange={e => setState(e.target.value)}
                  placeholder="State"
                  className="update-spot-input"
                />
              </label>
            </div>
          </div>
          <div className="update-spot-div">
            <div className="update-spot-input-inline-grid">
              <label className="update-spot-label">
                Latitude&nbsp;
                {errors.lat && (
                  <p className="update-spot-error-inline">{errors.lat}</p>
                )}
                <input
                  type="number"
                  value={lat}
                  onChange={e => setLat(e.target.value)}
                  placeholder="Latitude"
                  className="update-spot-input"
                />
              </label>
              ,&nbsp;
              <label className="update-spot-label">
                Longitude&nbsp;
                {errors.lng && (
                  <p className="update-spot-error-inline">{errors.lng}</p>
                )}
                <input
                  type="number"
                  value={lng}
                  onChange={e => setLng(e.target.value)}
                  placeholder="Longitude"
                  className="update-spot-input"
                />
              </label>
            </div>
          </div>
        </div>
        <div className="update-spot-form-section">
          <h2 className="update-spot-h2">Describe your place to guests</h2>
          <p className="update-spot-p">
            Mention the best features of your space, any special amenities like
            fast WiFi or parking, & what you love about the neighborhood.
          </p>
          <label className="update-spot-label no-label">
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description"
              className="update-spot-input"
            />
          </label>
          {errors.description && (
            <p className="update-spot-error">{errors.description}</p>
          )}
        </div>
        <div className="update-spot-form-section">
          <h2 className="update-spot-h2">Create a title for your spot</h2>
          <p className="update-spot-p">
            Catch guests&apos; attention with a spot title that highlights what
            makes your place special.
          </p>
          <label className="update-spot-label no-label">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name of Your Spot"
              className="update-spot-input"
            />
          </label>
          {errors.name && <p className="update-spot-error">{errors.name}</p>}
        </div>
        <div className="update-spot-form-section">
          <h2 className="update-spot-h2">Set a base price for your spot</h2>
          <p className="update-spot-p">
            Competitive pricing can help your listing stand out & rank higher in
            search results.
          </p>
          <label className="update-spot-label no-label">
            <div className="update-spot-input-inline">
              $
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="Price per night (USD)"
                className="update-spot-input"
              />
            </div>
          </label>
          {errors.price && <p className="update-spot-error">{errors.price}</p>}
        </div>
        <div className="update-spot-submit-button-div">
          <button
            type="submit"
            onSubmit={handleSubmit}
            disabled={isUpdateSpotButtonDisabled}
            className="update-spot-submit-button"
          >
            Update Your Spot
          </button>
        </div>
      </form>
    </main>
  );
};

export default UpdateSpotPage;