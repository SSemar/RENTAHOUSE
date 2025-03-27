// frontend/src/components/NewSpot/NewSpot.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as spotsActions from '../../store/spots';
import './NewSpot.css';

const NewSpot = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [image4, setImage4] = useState('');
  const [errors, setErrors] = useState({});
  const isCreateSpotButtonDisabled = Object.keys(errors).length;

  //!check if previewImage ends with .png, .jpg, or .jpeg
  const previewImageValidator = previewImage.length
    ? previewImage.endsWith('.png') ||
      previewImage.endsWith('.jpg') ||
      previewImage.endsWith('.jpeg')
    : true;
  const image1Validator = image1.length
    ? image1.endsWith('.png') ||
      image1.endsWith('.jpg') ||
      image1.endsWith('.jpeg')
    : true;
  const image2Validator = image2.length
    ? image2.endsWith('.png') ||
      image2.endsWith('.jpg') ||
      image2.endsWith('.jpeg')
    : true;
  const image3Validator = image3.length
    ? image3.endsWith('.png') ||
      image3.endsWith('.jpg') ||
      image3.endsWith('.jpeg')
    : true;
  const image4Validator = image4.length
    ? image4.endsWith('.png') ||
      image4.endsWith('.jpg') ||
      image4.endsWith('.jpeg')
    : true;


  //! useEffect to check if all fields are filled out
  useEffect(() => {
    const effectErrors = {};
    
    if (!country.trim().length) effectErrors.country = 'Country is required and cannot start or end with a space';
    if (!address.trim().length) effectErrors.address = 'Address is required and cannot start or end with a space';
    if (!city.trim().length) effectErrors.city = 'City is required and cannot start or end with a space';
    if (!state.trim().length) effectErrors.state = 'State is required and ccannot start or end with a space';
    if (!lat.trim().length) effectErrors.lat = 'Latitude is required and cannot start or end with a space';
    if (!lng.trim().length) effectErrors.lng = 'Longitude is required and cannot start or end with a space';
    if (!description.trim().length) effectErrors.description = 'Description is required and cannot start or end with a space';
    if (!name.trim().length) effectErrors.name = 'Name is required and cannot start or end with a space';
    if (!price.trim().length) effectErrors.price = 'Price is required and cannot start or end with a space';
    if (!previewImage.trim().length) effectErrors.previewImage = 'Preview image is required and cannot start or end with a space';
  
    setErrors(effectErrors);
    console.log(effectErrors);
  }, [
    country,
    address,
    city,
    state,
    lat,
    lng,
    description,
    name,
    price,
    previewImage,
  ]);

  const handleSubmit = e => {
    e.preventDefault();

    const validationErrors = {};
  
    if (!country.trim().length)
      validationErrors.country = 'Country is required and cannot start or end with a space';
    if (!address.trim().length)
      validationErrors.address = 'Address is required and cannot start or end with a space';
    if (!city.trim().length)
      validationErrors.city = 'City is required and cannot start or end with a space';
    if (!state.trim().length)
      validationErrors.state = 'State is required and cannot start or end with a space';
    if (!lat.trim().length)
      validationErrors.lat = 'Latitude is required and cannot start or end with a space';
    if (!lng.trim().length)
      validationErrors.lng = 'Longitude is required and cannot start or end with a space';
    if (!description.trim().length)
      validationErrors.description = 'Description is required and cannot start or end with a space';
    if (!name.trim().length)
      validationErrors.name = 'Name is required and cannot start or end with a space';
    if (!price.trim().length)
      validationErrors.price = 'Price is required and cannot start or end with a space';
    if (!previewImage.trim().length)
      validationErrors.previewImage = 'Preview image is required and cannot start or end with a space';
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop form submission if there are errors
    }
    
    const trimmedData = {
      country: country.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      lat: lat.trim(),
      lng: lng.trim(),
      description: description.trim(),
      name: name.trim(),
      price: price.trim(),
      previewImage: previewImage.trim(),
      image1: image1.trim(),
      image2: image2.trim(),
      image3: image3.trim(),
      image4: image4.trim(),
    };
  
    if (
      trimmedData.description.length > 29 &&
      trimmedData.previewImage.length &&
      previewImageValidator &&
      image1Validator &&
      image2Validator &&
      image3Validator &&
      image4Validator
    ) {
      setErrors({});
      let spotId;
  
      dispatch(
        spotsActions.postSpot({
          address: trimmedData.address,
          city: trimmedData.city,
          state: trimmedData.state,
          country: trimmedData.country,
          lat: trimmedData.lat,
          lng: trimmedData.lng,
          name: trimmedData.name,
          description: trimmedData.description,
          price: trimmedData.price,
        })
      )
        .catch(async res => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        })
        .then(async res => {
          const data = await res.json();
          spotId = data.id;
  
          dispatch(
            spotsActions.postSpotImages({
              spotId,
              previewImage: trimmedData.previewImage,
              image1: trimmedData.image1,
              image2: trimmedData.image2,
              image3: trimmedData.image3,
              image4: trimmedData.image4,
            })
          ).catch(async res => {
            const data = await res.json();
            if (data?.errors) {
              setErrors(data.errors);
            }
          });
  
          navigate(`/spots/${spotId}`);
        });
    } else {
      const validationErrors = {};
  
      if (trimmedData.description.length < 30)
        validationErrors.description =
          'Description must be at least 30 characters';
      if (!trimmedData.previewImage.length)
        validationErrors.previewImage = 'Preview image is required';
      if (!previewImageValidator)
        validationErrors.previewImage =
          'Preview image URL must end in .png, .jpg, or .jpeg';
      if (!image1Validator)
        validationErrors.image1 = 'Image URL must end in .png, .jpg, or .jpeg';
      if (!image2Validator)
        validationErrors.image2 = 'Image URL must end in .png, .jpg, or .jpeg';
      if (!image3Validator)
        validationErrors.image3 = 'Image URL must end in .png, .jpg, or .jpeg';
      if (!image4Validator)
        validationErrors.image4 = 'Image URL must end in .png, .jpg, or .jpeg';
  
      return setErrors(validationErrors);
    }
  };
  
  return (
    <main className="new-spot-main">
      <form onSubmit={handleSubmit} className="new-spot-form">
        <h1 className="new-spot-h1">Create a New Spot!</h1>
        <div className="new-spot-form-section">
          <h2 className="new-spot-h2">Where&apos;s your listing located?</h2>
          <p className="new-spot-p">
            Fill this form out to list your spot! You can always edit your spot!
          </p>
          <label className="new-spot-label">
            Country&nbsp;
            {errors.country && (
              <p className="new-spot-error-inline">{errors.country}</p>
            )}
            <input
              type="text"
              value={country}
              onChange={e => setCountry(e.target.value)}
              placeholder="Country"
              className="new-spot-input"
            />
          </label>
          <label className="new-spot-label">
            Street Address&nbsp;
            {errors.address && (
              <p className="new-spot-error-inline">{errors.address}</p>
            )}
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Street Address"
              className="new-spot-input"
            />
          </label>
          <div className="new-spot-div">
            <div className="new-spot-input-inline-grid">
              <label className="new-spot-label">
                City&nbsp;
                {errors.city && (
                  <p className="new-spot-error-inline">{errors.city}</p>
                )}
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="City"
                  className="new-spot-input"
                />
              </label>
              ,&nbsp;
              <label className="new-spot-label">
                State&nbsp;
                {errors.state && (
                  <p className="new-spot-error-inline">{errors.state}</p>
                )}
                <input
                  type="text"
                  value={state}
                  onChange={e => setState(e.target.value)}
                  placeholder="State"
                  className="new-spot-input"
                />
              </label>
            </div>
          </div>
          <div className="new-spot-div">
            <div className="new-spot-input-inline-grid">
              <label className="new-spot-label">
                Latitude&nbsp;
                {errors.lat && (
                  <p className="new-spot-error-inline">{errors.lat}</p>
                )}
                <input
                  type="number"
                  value={lat}
                  onChange={e => setLat(e.target.value)}
                  placeholder="Latitude"
                  className="new-spot-input"
                />
              </label>
              ,&nbsp;
              <label className="new-spot-label">
                Longitude&nbsp;
                {errors.lng && (
                  <p className="new-spot-error-inline">{errors.lng}</p>
                )}
                <input
                  type="number"
                  value={lng}
                  onChange={e => setLng(e.target.value)}
                  placeholder="Longitude"
                  className="new-spot-input"
                />
              </label>
            </div>
          </div>
        </div>
        <div className="new-spot-form-section">
          <h2 className="new-spot-h2">Description!</h2>
          <p className="new-spot-p">
            Sell your spot! Highlight what makes your space unique, and share about the house! What makes it special?
          </p>
          <label className="new-spot-label no-label">
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description"
              className="new-spot-input"
            />
          </label>
          {errors.description && (
            <p className="new-spot-error">{errors.description}</p>
          )}
        </div>
        <div className="new-spot-form-section">
          <h2 className="new-spot-h2">Create a name for your spot</h2>
          <p className="new-spot-p">
            What will you name your spot? Make it catchy! 
          </p>
          <label className="new-spot-label no-label">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name of Your Spot"
              className="new-spot-input"
            />
          </label>
          {errors.name && <p className="new-spot-error">{errors.name}</p>}
        </div>
        <div className="new-spot-form-section">
          <h2 className="new-spot-h2">Set your rate!</h2>
          <p className="new-spot-p">
            What will you charge per night? Please enter in USD.
          </p>
          <label className="new-spot-label no-label">
            <div className="new-spot-input-inline">
              $
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="Price per night (USD)"
                className="new-spot-input"
              />
            </div>
          </label>
          {errors.price && <p className="new-spot-error">{errors.price}</p>}
        </div>
        <div className="new-spot-form-section">
          <h2 className="new-spot-h2">Add images to your spots!</h2>
          <p className="new-spot-p">
            Share images of your spot! Show off your rooms/amenities!
          </p>
          <label className="new-spot-label no-label">
            <input
              type="text"
              value={previewImage}
              onChange={e => setPreviewImage(e.target.value)}
              placeholder="Preview Image URL"
              className="new-spot-input"
            />
          </label>
          {errors.previewImage && (
            <p className="new-spot-error">{errors.previewImage}</p>
          )}
          <label className="new-spot-label-image">
            <input
              type="text"
              value={image1}
              onChange={e => setImage1(e.target.value)}
              placeholder="Image URL"
              className="new-spot-input"
            />
          </label>
          {errors.image1 && <p className="new-spot-error">{errors.image1}</p>}
          <label className="new-spot-label-image">
            <input
              type="text"
              value={image2}
              onChange={e => setImage2(e.target.value)}
              placeholder="Image URL"
              className="new-spot-input"
            />
          </label>
          {errors.image2 && <p className="new-spot-error">{errors.image2}</p>}
          <label className="new-spot-label-image">
            <input
              type="text"
              value={image3}
              onChange={e => setImage3(e.target.value)}
              placeholder="Image URL"
              className="new-spot-input"
            />
          </label>
          {errors.image3 && <p className="new-spot-error">{errors.image3}</p>}
          <label className="new-spot-label-image">
            <input
              type="text"
              value={image4}
              onChange={e => setImage4(e.target.value)}
              placeholder="Image URL"
              className="new-spot-input"
            />
          </label>
          {errors.image4 && <p className="new-spot-error">{errors.image4}</p>}
        </div>
        <div className="new-spot-submit-button-div">
          <button
            type="submit"
            onSubmit={handleSubmit}
            disabled={isCreateSpotButtonDisabled}
            className="new-spot-submit-button"
          >
            Create Spot
          </button>
        </div>
      </form>
    </main>
  );
};

export default NewSpot;