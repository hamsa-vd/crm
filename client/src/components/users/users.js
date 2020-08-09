import React, { useState } from 'react';
import { Grid, Button, Segment, Popup, Form, Header, Icon } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { createUser, removeUser } from '../../redux/actions';
import UserCreateModal from './usercreatemodal';
import { MdDelete } from 'react-icons/md';

const managers = [ { name: 'Elon Musk', email: 'elon@tesla' }, { name: 'jeff Bezos', email: 'jeff@amazon' } ];
function Users() {
	const users = useSelector((state) => state.users);
	const dispatch = useDispatch();
	const options = managers.map((v, index) => ({ key: index, text: v.name, value: v.email }));
	const handleSelected = (val, key) => {
		const user = managers.find((v) => v.email === val);
		users.push(user);
		managers.splice(key, 1);
		dispatch(createUser(users));
		setOpen(false);
	};

	const [ password, setPassword ] = useState('');

	const passCheck = (index) => {
		if (!password) return;
		if (password !== 'g@L') return alert('password incorrect');
		users.splice(index, 1);
		dispatch(removeUser(users));
	};

	const [ open, setOpen ] = useState(false);
	return (
		<div className="container-fluid p-0">
			<Segment.Inline style={{ display: 'flex', justifyContent: 'flex-end', margin: '2rem 0.5rem' }}>
				<Popup
					trigger={<Button icon="add circle" content="add user" primary />}
					hoverable
					flowing
					open={open}
					on="click"
					onOpen={() => setOpen(true)}
					onClose={() => setOpen(false)}
				>
					<Form>
						<Form.Select
							label="user"
							placeholder="user"
							options={options}
							onChange={(e, { value, key }) => handleSelected(value, key)}
						/>
					</Form>
				</Popup>
				<UserCreateModal />
			</Segment.Inline>
			{users.length ? (
				<Grid celled>
					<Grid.Row columns="equal" textAlign="center">
						<Grid.Column width={2} only="computer">
							{' '}
							<Header>index</Header>
						</Grid.Column>
						{Object.keys(users[0]).map((v, index) => (
							<Grid.Column key={index}>
								<Header>{v}</Header>
							</Grid.Column>
						))}
						<Grid.Column computer={2} mobile={3} tablet={2}>
							<Header content="del" />
						</Grid.Column>
					</Grid.Row>
					{users.map((obj, idx) => (
						<Grid.Row key={idx} columns="equal" textAlign="center">
							<Grid.Column key={idx} width={2} only="computer">
								{idx}
							</Grid.Column>
							{Object.keys(obj).map((v, index) => (
								<Grid.Column style={{ overflow: 'none' }} key={index}>
									{obj[v]}
								</Grid.Column>
							))}
							<Grid.Column computer={2} mobile={3} tablet={2}>
								<Popup
									style={{ width: '300px' }}
									position="left center"
									trigger={
										<MdDelete
											style={{ fontSize: '1.75rem', cursor: 'pointer', color: 'red' }}
											onClick={() => alert('Guest Password is g@L')}
										/>
									}
									hoverable
									flowing
									on="click"
								>
									<Segment>
										<Header color="red">Password</Header>
										<Form onSubmit={() => passCheck(idx)}>
											<Form.Input
												type="text"
												fluid
												placeholder="password"
												onChange={(e, { value }) => setPassword(value)}
											/>
											<Form.Button type="submit" inverted color="green" content="check" />
										</Form>
									</Segment>
								</Popup>
							</Grid.Column>
						</Grid.Row>
					))}
				</Grid>
			) : (
				<Header as="h1" color="orange">
					No users available. Make a contact to view
				</Header>
			)}
		</div>
	);
}

export default Users;
