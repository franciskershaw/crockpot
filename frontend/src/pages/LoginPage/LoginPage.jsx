import { Link } from 'react-router-dom';

const LoginPage = () => {
	return (
		<div className="container container--sm flex items-center">
			<div className="flex flex-col flex-grow border border-black space-y-6 p-4 rounded-2xl">
				<h1 className="text-h3 capitalize text-center">Log in</h1>
				<form className="form w-full space-y-3" id="login">
					<div className="form__input">
						<label for="name">Username</label>
						<input type="text" id="name" name="name" required></input>
					</div>
					<div className="form__input">
						<label for="password">Password</label>
						<input type="text" id="password" name="password" required></input>
					</div>
				</form>
				<button className="btn mx-auto" type="submit" form="login" value="Log in">Log in</button>
				<div className='text-center'>
					<p>Don't have an account?</p>
					<Link to={'register'} className="underline">
						Register
					</Link>
				</div>
			</div>
		</div>
	)
}

export default LoginPage