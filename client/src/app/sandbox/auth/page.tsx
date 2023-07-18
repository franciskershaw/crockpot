import AuthForm from './components/AuthForm';

const AuthComponentsPage = () => {
  return (
    <div className="tw p-4">
      <div className="mb-4">
        <AuthForm type="login" />
      </div>
      <div>
        <AuthForm type="register" />
      </div>
    </div>
  );
};
export default AuthComponentsPage;
