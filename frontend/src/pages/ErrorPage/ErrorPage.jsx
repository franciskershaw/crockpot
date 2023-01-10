import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="container flex flex-col items-center">
			<h1>404</h1>
      <Link className="btn" to={'/'}>
        Go home
      </Link>
    </div>
  );
};

export default ErrorPage;
