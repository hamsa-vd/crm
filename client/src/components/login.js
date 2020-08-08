import React, { useState } from 'react';
import ReactLoading from 'react-loading';
import { toast } from 'react-toastify';
import { FaHome } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import { GiArrowed } from 'react-icons/gi';
import { RiLoginCircleLine, RiLockPasswordLine, RiUser3Line } from 'react-icons/ri';
import { useForm } from 'react-hook-form';
import { useHistory, Link } from 'react-router-dom';
import Axios from 'axios';
function Login() {
	const [ loading, setLoading ] = useState(false);
	const history = useHistory();
	const { register, handleSubmit, errors } = useForm({ mode: 'onChange' });
	const onLogin = async (formdata) => {
		if (!Object.keys(errors).length) {
			setLoading(true);
			// const data = await Axios.post('https://hava-crm.herokuapp.com/api/login', formdata);
			const data = await Axios.post('http://hava-crm/herokuapp.com/api/login', formdata);
			setLoading(false);
			if (data.data.status) {
				localStorage.setItem('token', data.data.out.token);
				localStorage.setItem('username', data.data.out.username);
				localStorage.setItem('cadre', data.data.out.cadre);
				toast.success(data.data.msg);
				history.push('/dashboard/leads');
			} else toast.error(data.data.msg);
		}
	};
	const guestLogin = (e) => {
		localStorage.setItem('token', Math.random().toString(36).substring(7));
		localStorage.setItem('username', 'Guest');
		localStorage.setItem('cadre', 'guest');
	};
	return (
		<div>
			{loading && <ReactLoading className="loading" type={'bubbles'} color={'#fff'} />}
			<div className="parent_login">
				<div className="container-fluid">
					<Link to="/" className=" position-fixed fixed-top m-3">
						<button className="btn btn-outline-light">
							<FaHome size="1.2rem" /> Home
						</button>
					</Link>
					<div className="col-sm-10 col-lg-4">
						<form className="row justify-content-around" onSubmit={handleSubmit(onLogin)}>
							<div className="input-group mb-3">
								<small style={{ color: 'white' }}>all fields are required</small>
								<div className="input-group-prepend">
									<span className="input-group-text" id="basic-addon1">
										<FiUser className="mr-1" color={'brown'} />username
									</span>
								</div>
								<input
									ref={register({ required: true })}
									type="text"
									className="form-control"
									aria-label="Username"
									aria-describedby="basic-addon1"
									name="username"
								/>
								{errors.username &&
								errors.username.type === 'required' && <small>username is required</small>}
							</div>
							<div className="input-group mb-3">
								<div className="input-group-prepend">
									<span className="input-group-text" id="basic-addon1">
										<RiLockPasswordLine className="mr-1" color={'brown'} /> password
									</span>
								</div>
								<input
									ref={register({ required: true })}
									type="password"
									className="form-control"
									aria-label="password"
									aria-describedby="basic-addon1"
									name="password"
								/>
								{errors.password &&
								errors.password.type === 'required' && <small>password is required</small>}
							</div>
							<Link to="/dashboard/leads">
								<button className="btn btn-outline-light px-4 mt-3" onClick={guestLogin}>
									<RiUser3Line className="mr-1" size={'1.2rem'} /> Guest
								</button>
							</Link>
							<Link to="/forgot">
								<button className="btn btn-outline-light px-4 mt-3">
									<GiArrowed className="mr-1" size={'1.2rem'} />forgot password
								</button>
							</Link>
							<button type="submit" className="btn btn-outline-light px-4 mt-3">
								<RiLoginCircleLine className="mr-1" size={'1.2rem'} />login
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
