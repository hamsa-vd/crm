import React, { useState } from 'react';
import ReactLoading from 'react-loading';
import { RiLockPasswordLine } from 'react-icons/ri';
import { GiArrowScope } from 'react-icons/gi';
import { useHistory, useParams } from 'react-router-dom';
import Axios from 'axios';
import { toast } from 'react-toastify';
function Passchange() {
	const [ loading, setLoading ] = useState(false);
	const [ pass, setPass ] = useState('');
	const [ changepass, setChangepass ] = useState('');
	const history = useHistory();
	const { id } = useParams();
	const handleSubmit = async () => {
		if (pass && pass === changepass) {
			setLoading(true);
			const data = await Axios.post('https://hava-chat.herokuapp.com/api/changepass', { password: pass, id });
			setLoading(false);
			if (data.data.status) toast.success(data.data.msg);
			else toast.error(data.data.msg);
			history.push('/login');
		} else toast.info('passwords must match');
	};
	return (
		<div className="parent_new_pwd container-fluid">
			{loading && <ReactLoading className="loading" type={'bubbles'} color={'#fff'} />}
			<div className="col-sm-10 col-lg-4">
				<div className="row justify-content-around">
					<div className="input-group mb-3">
						<div className="input-group-prepend">
							<span className="input-group-text" id="basic-addon1">
								<RiLockPasswordLine color="brown" className="mr-1" /> Password
							</span>
						</div>
						<input
							type="password"
							className="form-control"
							aria-label="password"
							aria-describedby="basic-addon1"
							onChange={(e) => setPass(e.target.value)}
						/>
					</div>
					<div className="input-group mb-3">
						<div className="input-group-prepend">
							<span className="input-group-text" id="basic-addon1">
								<RiLockPasswordLine color="brown" className="mr-1" /> Confirm Password
							</span>
						</div>
						<input
							type="password"
							className="form-control"
							aria-label="conf_password"
							aria-describedby="basic-addon1"
							onChange={(e) => setChangepass(e.target.value)}
						/>
					</div>
					<button className="btn btn-outline-light" onClick={handleSubmit}>
						<GiArrowScope className="mr-1" />update password
					</button>
				</div>
			</div>
		</div>
	);
}

export default Passchange;
