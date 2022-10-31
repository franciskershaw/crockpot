import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/auth/useAuth';
import { useUser } from '../../hooks/auth/useUser';
import { usePrefetchRecipes } from '../../hooks/recipes/useRecipes';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const { username, password } = formData;

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

    const userData = {
      username,
      password,
    };

    auth.signin(userData);
  };

  return (
    <div className="container container--sm flex items-center centered">
      <div className="form-card">
        <h1 className="h2 capitalize text-center">Log in</h1>
        <form onSubmit={onSubmit} className="form w-full space-y-3" id="login">
          <div className="form__input">
            <label htmlFor="username">Username</label>
            <input
              value={username}
              onChange={onChange}
              type="text"
              id="username"
              name="username"
              required
            />
          </div>
          <div className="form__input">
            <label htmlFor="password">Password</label>
            <input
              value={password}
              onChange={onChange}
              type="password"
              id="password"
              name="password"
              required
            />
          </div>
        </form>
        <button
          className="btn btn--secondary mx-auto"
          type="submit"
          form="login"
          value="Log in">
          Log in
        </button>
        <div className="text-center">
          <p>Don't have an account?</p>
          <Link to={'/register'} className="underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
