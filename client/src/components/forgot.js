import React, { useState } from 'react';
import { GiLobArrow } from 'react-icons/gi';
import { AiOutlineMail } from 'react-icons/ai';
import Axios from 'axios';
import { toast } from 'react-toastify';
import ReactLoading from 'react-loading';

function Forgot() {
	const [ email, setEmail ] = useState('');
	const [ loading, setLoading ] = useState(false);
	const handleSubmit = async () => {
		if (email) {
			console.log(email);
			setLoading(true);
			const data = await Axios.post('https://hava-chat.herokuapp.com/api/forgot', { email });
			setLoading(false);
			if (data.data.status) toast.success('mail sent ' + data.data.msg);
			else toast.error(data.data.msg);
		} else toast.info('email required');
	};
	return (
		<div className="parent_forgot container-fluid">
			{loading && <ReactLoading className="loading" type={'bubbles'} color={'#fff'} />}
			<div className="col-sm-10 col-lg-4">
				<div className="row justify-content-around">
					<div className="input-group mb-3">
						<div className="input-group-prepend">
							<span className="input-group-text" id="basic-addon1">
								<AiOutlineMail color="brown" className="mr-1" /> email
							</span>
						</div>
						<input
							type="email"
							name="email"
							className="form-control"
							aria-label="email"
							aria-describedby="basic-addon1"
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<button className="btn btn-outline-light" onClick={handleSubmit}>
						<GiLobArrow className="mr-1" size={'1.2rem'} />change password
					</button>
				</div>
			</div>
		</div>
	);
}

export default Forgot;
