import React from 'react';
import Svg from './svg';
import { Link } from 'react-router-dom';
import { RiLoginCircleLine, RiLoginBoxLine, RiUser3Line } from 'react-icons/ri';
function Home() {
	return (
		<div className="home_parent">
			<div className="container row justify-content-around">
				<Link to="/register">
					<button className="btn btn-outline-light btn-lg m-2 ">
						{' '}
						<RiLoginBoxLine className="mr-1" />
						Register
					</button>
				</Link>
				<Link to="/dashboard">
					<button className="btn btn-outline-light btn-lg m-2">
						<RiUser3Line className="mr-1" /> Guest
					</button>
				</Link>
				<Link to="/login">
					<button className="btn btn-outline-light btn-lg m-2">
						{' '}
						<RiLoginCircleLine className="mr-1" /> Login
					</button>
				</Link>
			</div>
			<Svg />
		</div>
	);
}

export default Home;
