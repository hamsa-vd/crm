import React, { useState, useEffect } from 'react';
import { Redirect, useParams, Link } from 'react-router-dom';
import ReactLoading from 'react-loading';
import Header from './Header';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../redux/actions';
import rest from '../rest.service';
import { createMedia } from '@artsy/fresnel';
import Leads from './leads/leads';
import Contacts from './contacts';
import Users from './users/users';
import Services from './services/services';
import guestData from '../redux/guestdata';

const { MediaContextProvider, Media } = createMedia({
	breakpoints: {
		nothing: 0,
		tablet: 800
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
							const data = await rest.getDetails();
							console.log(data.data.out);
							dispatch(actions.allDetails(data.data.out));
							setLoading(false);
						} catch (err) {
							console.log(err);
						}
					})();
				})();
			} else dispatch(actions.allDetails(guestData));
		}
		return () => localStorage.clear();
	}, []);
	useEffect(
		() => {
			setRelation(params.relation);
		},
		[ params ]
	);

	const showChild = () => {
		switch (params.relation) {
			case 'leads':
				return <Leads />;
			case 'contacts':
				return <Contacts />;
			case 'users':
				return <Users />;
			case 'services':
				return <Services />;
			default:
				return (
					<div className="container-fluid row justify-content-center align-items-center">
						Only avaliable fields are{' '}
						{Object.keys(relations).map((v) => (
							<Link to={`/dashboard/${v}`}>
								{' '}
								<button className="btn btn-outline-info m-3">{v}</button>
							</Link>
						))}
					</div>
				);
		}
	};

	return (
		<div className="container-fluid dashboard-parent">
			{redirect && <Redirect to="/login" />}
			<header className="container-fluid">
				<Header />
				{loading && <ReactLoading className="loading" type={'bubbles'} color={'#fff'} />}
			</header>
			<div className="container-lg container-fluid">{showChild()}</div>
		</div>
	);
}

export default Dashboard;
