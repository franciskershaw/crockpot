import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUser } from '../../hooks/auth/useUser';
import AuthForm from './AuthForm/AuthForm';

const AuthPage = ({ page }) => {
  document.title = `Crockpot | ${page === 'register' ? 'Sign up!' : 'Login'}`;

  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      return navigate('/browse');
    }
  }, [user]);

  return (
    <div className="container container--sm flex items-center centered training-wheels">
      <AuthForm type={page} />
    </div>
  );
};

export default AuthPage;
