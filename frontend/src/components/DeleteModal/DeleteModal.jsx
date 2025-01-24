import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as spotsActions from '../../store/spots';
import './DeleteModal.css';
//import DeleteModal from '.';

const DeleteModal = ({ type, spotId, reviewId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = e => {
    e.preventDefault();

    if (type === 'spot') {
      return dispatch(spotsActions.deleteSpot(spotId)).then(closeModal);
    }

    if (type === 'review') {
      return dispatch(spotsActions.deleteReview(reviewId, spotId)).then(
        closeModal
      );
    }
  };

  return (
    <main className="delete-item-modal-main">
      <h1 className="delete-item-modal-h1">Confirm Delete</h1>
      <form onSubmit={handleSubmit} className="delete-item-modal-form">
        <p className="delete-item-modal-text">
          Are you sure you want to {type === 'review' && 'delete this review'}
          {type === 'spot' && 'remove this spot from the listings'}?
        </p>
        <button type="submit" className="delete-item-modal-yes-button">
          Yes (Delete {type === 'review' && 'Review'}
          {type === 'spot' && 'Spot'})
        </button>
        <button
          type="button"
          onClick={closeModal}
          className="delete-item-modal-no-button"
        >
          No (Keep {type === 'review' && 'Review'}
          {type === 'spot' && 'Spot'})
        </button>
      </form>
    </main>
  );
};

export default DeleteModal;