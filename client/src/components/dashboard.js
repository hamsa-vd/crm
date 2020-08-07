import React, { useState, useEffect } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';
import Header from './Header';
import { useSelector, useDispatch } from 'react-redux';
import Axios from 'axios';
import actions from '../redux/actions';
const authAxios = Axios.create({
	baseURL: 'http://localhost:4200/api',
	headers: {
		Authorization: `Bearer ${localStorage.getItem('token')}`
	}
});
function Dashboard() {
	const [ relation, setRelation ] = useState('leads');
	const [ redirect, setRedirect ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const params = useParams();
	const relations = useSelector((state) => state);
	const dispatch = useDispatch();
	useEffect(() => {
		if (!!!localStorage.getItem('token')) setRedirect(true);
		else {
			if (localStorage.getItem('cadre') !== 'guest') {
				(async () => {
					setLoading(true);
					(async () => {
						try {
							const data = await authAxios.get('/getdetails');
							console.log(data.data.out);
							dispatch(actions.allDetails(data.data.out));
							setLoading(false);
						} catch (err) {
							console.log(err);
						}
					})();
				})();
			}
		}
		return () => localStorage.clear();
	}, []);
	useEffect(
		() => {
			setRelation(params.relation);
		},
		[ params ]
	);
	return (
		<div className="container-fluid dashboard-parent">
			{redirect && <Redirect to="/login" />}
			<header className="container-fluid">
				<Header />
				{loading && <ReactLoading className="loading" type={'bubbles'} color={'#fff'} />}
			</header>
			<div className="container-lg container-fluid">{params.relation}</div>
		</div>
	);
}

export default Dashboard;
