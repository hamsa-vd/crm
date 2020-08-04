import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
function Dashboard() {
	const [ leads, setLeads ] = useState(0);
	const [ contacts, setContacts ] = useState(0);
	const [ services, setServices ] = useState(0);
	const [ redirect, setRedirect ] = useState(false);
	useEffect(() => {
		if (!!!localStorage.getItem('token')) setRedirect(true);
		return () => localStorage.clear();
	}, []);
	return (
		<div className="container-fluid dashboard-parent">
			{redirect && <Redirect to="/login" />}
			<div className="container-fluid container-lg sub">
				<div className="row justify-content-around">
					<button className="btn btn-outline-success">create user</button>
				</div>
				<div className="row justify-content-around">
					<div className="card btn btn-outline-dark col-sm-11 col-md-7 col-lg-3 mt-3">
						<div className="card-body">
							<h2 className="card-text">leads -- 0</h2>
						</div>
					</div>
					<div className="card btn btn-outline-dark col-sm-11 col-md-7 col-lg-3 mt-3">
						<div className="card-body">
							<h2 className="card-text" />
						</div>
					</div>
					<div className="card btn btn-outline-dark col-sm-11 col-md-7 col-lg-3 mt-3">
						<div className="card-body">
							<h2 className="card-text">contacts -- 0</h2>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
