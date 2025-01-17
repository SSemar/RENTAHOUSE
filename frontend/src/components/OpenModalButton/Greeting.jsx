
import OpenModalButton from './OpenModalButton';

const Greeting = () => {
  return (
    <OpenModalButton
      buttonText="Greeting"
      modalComponent={<h2>Hello World!</h2>}
      onButtonClick={() => console.log("Greeting initiated")}
      onModalClose={() => console.log("Greeting completed")}
    />
  );
};

export default Greeting;