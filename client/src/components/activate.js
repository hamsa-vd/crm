import React, { useEffect, useState } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import Axios from 'axios';
import { toast } from 'react-toastify';
function Activate() {
	const [ redirect, setRedirect ] = useState(false);
	const { id } = useParams();
	useEffect(
		() => {
			(async () => {
				const data = await Axios.get(`https://hava-chat.herokuapp.com/api/activate/${id}`);
				if (data.data.status) toast.success(data.data.msg);
				else toast.error(data.data.msg);
				setRedirect(true);
			})();
			return () => {};
		},
		[ id ]
	);
	return (
		<div className="parent-activate">
			<button>Goto Login Page</button>
			{redirect && <Redirect to="/login" />}
		</div>
	);
}

export default Activate;
