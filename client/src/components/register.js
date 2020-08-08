import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { FiUser } from 'react-icons/fi';
import { RiLoginBoxLine, RiLockPasswordLine, RiUser3Line } from 'react-icons/ri';
import { AiOutlineMail } from 'react-icons/ai';
import { toast } from 'react-toastify';
import ReactLoading from 'react-loading';
import { useHistory, Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
function Register() {
	const [ loading, setLoading ] = useState(false);
	const { register, handleSubmit, errors } = useForm({ mode: 'onChange' });
	const history = useHistory();
	const guestLogin = (e) => {
		localStorage.setItem('token', Math.random().toString(36).substring(7));
		localStorage.setItem('username', 'Guest');
		localStorage.setItem('cadre', 'guest');
	};
	const onSubmit = async (formdata) => {
		if (formdata.password === formdata.checkPassword && !Object.keys(errors).length) {
			const body = formdata;
			delete body.checkPassword;
			console.log(body);
			setLoading(true);
			const data = await axios.post('https://hava-crm.herokuapp.com/api/register', body);
			setLoading(false);
			if (data.data.status) {
				toast.success(data.data.msg);
				history.push('/login');
			} else toast.error(data.data.msg);
		} else toast.info("password didn't match");
	};
	return (
		<div>
			{loading && <ReactLoading className="loading" type={'bubbles'} color={'#fff'} />}
			<div className="parent_register">
				<div className="container-fluid">
					<div className="position-fixed fixed-top m-3 row">
						<Link to="/" className="m-2">
							<button className="btn btn-outline-light">
								<FaHome size="1.2rem" /> Home
							</button>
						</Link>
						<Link to="/dashboard/leads" className="m-2" onClick={guestLogin}>
							<button className="btn btn-outline-light">
								<RiUser3Line size="1.2rem" /> Guest
							</button>
						</Link>
					</div>
					<div className="col-sm-10 col-lg-4">
						<form className="row justify-content-center" onSubmit={handleSubmit(onSubmit)}>
							<div className="input-group mb-3">
								<small style={{ color: 'white' }}>all fields are required</small>
								<div className="input-group-prepend">
									<span className="input-group-text" id="basic-addon1">
										<AiOutlineMail color="brown" className="mr-1" /> email
									</span>
								</div>
								<input
									type="email"
									className="form-control"
									name="email"
									aria-label="email"
									aria-describedby="basic-addon1"
									ref={register({ required: true })}
								/>
								{errors.email && errors.email.type === 'required' && <small>email is required</small>}
							</div>
							<div className="input-group mb-3">
								<div className="input-group-prepend">
									<span className="input-group-text" id="basic-addon1">
										<FiUser color="brown" className="mr-1" /> firstname
									</span>
								</div>
								<input
									type="text"
									className="form-control"
									name="firstname"
									aria-label="lastname"
									aria-describedby="basic-addon1"
									ref={register({ required: true })}
								/>
								{errors.firstname &&
								errors.firstname.type === 'required' && <small>firstname is required</small>}
							</div>
							<div className="input-group mb-3">
								<div className="input-group-prepend">
									<span className="input-group-text" id="basic-addon1">
										<FiUser color="brown" className="mr-1" /> lastname
									</span>
								</div>
								<input
									type="text"
									className="form-control"
									name="lastname"
									aria-label="lastname"
									aria-describedby="basic-addon1"
									ref={register({ required: true })}
								/>
								{errors.lastname &&
								errors.lastname.type === 'required' && <small>lastname is required</small>}
							</div>
							<div className="input-group mb-3">
								<div className="input-group-prepend">
									<span className="input-group-text" id="basic-addon1">
										<RiLockPasswordLine color="brown" className="mr-1" /> Password
									</span>
								</div>
								<input
									type="password"
									className="form-control"
									name="password"
									aria-label="password"
									aria-describedby="basic-addon1"
									ref={register({ required: true })}
								/>
								{errors.password &&
								errors.password.type === 'required' && <small>password is required</small>}
							</div>
							<div className="input-group mb-3">
								<div className="input-group-prepend">
									<span className="input-group-text" id="basic-addon1">
										<RiLockPasswordLine color="brown" className="mr-1" /> confirm password
									</span>
								</div>
								<input
									type="password"
									className="form-control"
									name="checkPassword"
									aria-label="conf_password"
									aria-describedby="basic-addon1"
									ref={register({ required: true })}
								/>
								{errors.changePassword &&
								errors.changePassword.type === 'required' && <small>changePassword is required</small>}
							</div>
							<button className="btn btn-outline-light m-3" type="submit">
								<RiLoginBoxLine size="1.2rem" /> Sign Up
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Register;
