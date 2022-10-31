import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUser } from '../../hooks/auth/useUser';
import { useAuth } from '../../hooks/auth/useAuth';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const { username, password, confirmPassword } = formData;

  const navigate = useNavigate();
  const auth = useAuth();
  const { user } = useUser();
  usePrefetchRecipes()

  useEffect(() => {
    if (user) {
      return navigate('/browse');
    }
  }, [user]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      const userData = {
        username,
        password,
      };
      auth.signup(userData);
    }
  };

  return (
    <div className="container container--sm flex items-center centered">
      <div className="form-card">
        <h1 className=" capitalize text-center">Register</h1>
        <form onSubmit={onSubmit} className="form w-full space-y-3" id="login">
          <div className="form__input">
            <label htmlFor="username">Username</label>
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
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={onChange}
            />
          </div>
          <div className="form__input">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              value={confirmPassword}
              onChange={onChange}
            />
          </div>
        </form>
        <button
          className="btn btn--secondary mx-auto"
          type="submit"
          form="login"
          value="Register">
          Register
        </button>
        <div className="text-center">
          <p>Already have an account?</p>
          <Link to={'/login'} className="underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
