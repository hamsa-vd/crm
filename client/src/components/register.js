import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { FiUser } from 'react-icons/fi';
import { RiLoginBoxLine, RiLockPasswordLine } from 'react-icons/ri';
import { AiOutlineMail } from 'react-icons/ai';
import { toast } from 'react-toastify';
import ReactLoading from 'react-loading';
import { useHistory } from 'react-router-dom';
function Register() {
	const [ loading, setLoading ] = useState(false);
	const { register, handleSubmit, errors } = useForm({ mode: 'onChange' });
	const history = useHistory();
	const onSubmit = async (formdata) => {
		if (formdata.password === formdata.checkPassword && !Object.keys(errors).length) {
			const body = formdata;
			delete body.checkPassword;
			console.log(body);
			setLoading(true);
			const data = await axios.post('https://hava-chat.herokuapp.com/api/register', body);
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
					<div className="col-sm-10 col-lg-4">
						<form className="row justify-content-center" onSubmit={handleSubmit(onSubmit)}>
							<div className="input-group mb-3">
								<small style={{ color: 'white' }}>all fields are required</small>
								<div className="input-group-prepend">
									<span className="input-group-text" id="basic-addon1">
										<FiUser color="brown" className="mr-1" /> Username
									</span>
								</div>
								<input
									type="text"
									className="form-control"
									name="username"
									aria-label="Username"
									aria-describedby="basic-addon1"
									ref={register({ required: true })}
								/>
								{errors.username &&
								errors.username.type === 'required' && <small>username is required</small>}
							</div>
							<div className="input-group mb-3">
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
							<button className="btn btn-outline-light" type="submit">
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
