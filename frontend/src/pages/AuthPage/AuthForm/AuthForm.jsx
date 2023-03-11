import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../../hooks/auth/useAuth';
import { toast } from 'react-toastify';

const AuthForm = ({ type }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const { username, password, confirmPassword } = formData;

  const auth = useAuth();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = { username, password };
    if (type === 'register') {
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
      } else {
        auth.signup(userData);
      }
    } else if (type === 'login') {
      auth.signin(userData);
    }
  };
  return (
    <div className="form-card">
      <form
        onSubmit={onSubmit}
        className="training-wheels form w-full space-y-3">
        <h1 className="h2 text-center">
          {type === 'login' ? 'Log into Crockpot' : 'Sign up to Crockpot'}
        </h1>
        <div className="form__input">
          <label htmlFor="">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            value={username}
            onChange={onChange}
          />
        </div>
        <div className="form__input">
          <label htmlFor="">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={onChange}
            autoComplete="on"
          />
        </div>
        {type === 'register' && (
          <div className="form__input">
            <label htmlFor="">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              value={confirmPassword}
              onChange={onChange}
              autoComplete="on"
            />
          </div>
        )}
        <div className="flex items-center justify-center">
          <button className="btn btn--secondary">
            {type === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </div>

        <div className="text-center">
          {type === 'login' ? (
            <>
              <p>Don't have an account?</p>
              <Link to={'/register'}>Register</Link>
            </>
          ) : (
            <>
              <p>Already have an account?</p>
              <Link to={'/login'}>Log In</Link>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
