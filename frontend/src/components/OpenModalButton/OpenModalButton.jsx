

import { useModal } from '../../context/Modal';

function OpenModalButton({
  modalComponent, 
  buttonText, 
  onButtonClick, 
  onModalClose,
  className // Add className as a prop
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onButtonClick === "function") onButtonClick();
  };

  return <button 
  className={className} onClick={onClick}>{buttonText}
  </button>;
}

export default OpenModalButton;