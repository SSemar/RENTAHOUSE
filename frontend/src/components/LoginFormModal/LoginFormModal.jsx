

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const isLoginButtonDisabled = credential.length < 4 || password.length < 6;



  const handleSubmit = e => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async res => {
        const data = await res.json();
        // Equivalent to `if (data && data.errors) {`
        if (data?.errors) {
          setErrors(data.errors);
        }
      });
  };

  const logInDemoUser = () => {
    return dispatch(
      sessionActions.login({
        credential: 'DemoUser',
        password: 'password',
      })
    ).then(closeModal);
  };

  return (
    <main className="login-form-main">
      <h1 className="login-h1">Log In</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <label className="login-label">
          
          <input
            type="text"
            value={credential}
            onChange={e => setCredential(e.target.value)}
            placeholder="Username or Email"
            required
            className="login-input"
          />
        </label>
        <label className="login-label">
          
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="login-input"
          />
        </label>
        {errors.credential && (
          <p className="login-error">{errors.credential}</p>
        )}
        <button
          type="submit"
          disabled={isLoginButtonDisabled}
          className="login-button"
        >
          Log In
        </button>
      </form>
      <button
        type="submit"
        onClick={logInDemoUser}
        className="demo-user-login-button"
      >
        Log In as Demo User
      </button>
    </main>
  );
};

export default LoginFormModal;