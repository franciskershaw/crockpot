interface Props {
  type: 'register' | 'login';
}

const AuthForm = (props: Props) => {
	const heading = props.type === 'register' ? 'Sign up for an account' : 'Login'
  return (
    <form className='border border-black rounded-sm py-6 px-4'>
			<h3 className='text-center'>{heading}</h3>
			<div className='flex flex-col'>
				<label htmlFor="">Username</label>
				<input type="text" />
			</div>
    </form>
  );
};
export default AuthForm;
