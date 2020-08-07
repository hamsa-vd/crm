import React, { useState } from 'react';
import { Menu, Button, Icon, Label, Sidebar, Segment } from 'semantic-ui-react';
import { createMedia } from '@artsy/fresnel';
import { NavLink, useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
const { MediaContextProvider, Media } = createMedia({
	breakpoints: {
		nothing: 0,
		tablet: 800
	}
});
function Header() {
	const [ display, setDisplay ] = useState('leads');
	const [ slide, setSlide ] = useState(false);
	const params = useParams();
	const data = useSelector((state) => state);
	const dispatch = useDispatch();
	useEffect(
		() => {
			setDisplay(params.relation);
		},
		[ params ]
	);
	const headerForLarge = (lst) => (
		<Menu pointing>
			{lst.map((v) => (
				<Menu.Item
					key={v}
					name={v}
					active={display === v}
					onClick={(e, { name }) => setDisplay(name)}
					as={NavLink}
					to={`/dashboard/${v}`}
				>
					<Button as="div" labelPosition="right">
						<Button basic color="violet">
							<Icon name="heart" color={display === v ? 'red' : 'teal'} />
							{v}
						</Button>
						<Label color={display === v ? 'violet' : 'blue'} pointing="left">
							{data[v].length}
						</Label>
					</Button>
				</Menu.Item>
			))}
			<Menu.Menu position="right">
				<Menu.Item>
					{localStorage.getItem('cadre') === 'guest' ? (
						<Button as={Link} inverted color="instagram" to="/register">
							<Icon name="sign in" />
							Sign Up
						</Button>
					) : (
						<Button as={Link} inverted color="red" to="/" onClick={() => localStorage.clear()}>
							<Icon name="log out" />
							logout
						</Button>
					)}
				</Menu.Item>
			</Menu.Menu>
		</Menu>
	);

	const headerForSmall = (lst) => (
		<Menu secondary>
			<Menu.Item as="a" checked={slide} onClick={(e) => setSlide((initial) => !initial)}>
				{slide ? <Icon name="arrow left" /> : <Icon name="align left" />}
			</Menu.Item>
			<Menu.Menu position="right">
				<Menu.Item>
					{localStorage.getItem('cadre') === 'guest' ? (
						<Button inverted color="instagram" as={Link} to="/register">
							<Icon name="sign in" />
							Sign Up
						</Button>
					) : (
						<Button as={Link} to="/" inverted color="red" onClick={() => localStorage.clear()}>
							<Icon name="log out" />
							logout
						</Button>
					)}
				</Menu.Item>
			</Menu.Menu>
			<Sidebar
				as={Segment}
				style={{ overflow: 'hidden' }}
				visible={slide}
				animation="scale down"
				direction="left"
			>
				<Menu secondary vertical as={Segment}>
					<Icon
						as="i"
						style={{ cursor: 'pointer', marginBottom: '1rem' }}
						name="arrow left"
						onClick={() => setSlide((initial) => !initial)}
						size="large"
					/>
					{lst.map((v) => (
						<Menu.Item
							key={v}
							as={NavLink}
							active={display === v}
							onClick={(e) => setDisplay(v)}
							to={`/dashboard/${v}`}
						>
							{v}
						</Menu.Item>
					))}
				</Menu>
			</Sidebar>
		</Menu>
	);

	return (
		<div className="container-fluid header-parent">
			<MediaContextProvider>
				<Media at="nothing">{headerForSmall(Object.keys(data))}</Media>
				<Media greaterThanOrEqual="tablet">{headerForLarge(Object.keys(data))}</Media>
			</MediaContextProvider>
		</div>
	);
}

export default Header;
