import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/browse');
  }, []);

  return <div>Homepage</div>;
};

export default LandingPage;
