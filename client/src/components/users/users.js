import React, { useState, useEffect } from 'react';
import { Grid, Button, Segment, Popup, Form, Header, Icon } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { createUser, removeUser } from '../../redux/actions';
import UserCreateModal from './usercreatemodal';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import rest from '../../rest.service';

let managers = [ { name: 'Elon Musk', email: 'elon@tesla' }, { name: 'jeff Bezos', email: 'jeff@amazon' } ];
function Users() {
	const users = useSelector((state) => state.users);
	const dispatch = useDispatch();
	const options = managers.map((v, index) => ({ key: index, text: v.name, value: v.email }));

	useEffect(() => {
		if (localStorage.getItem('cadre') === 'manager')
			(async () => {
				try {
					const data = await rest.allManagers();
					if (data.data.status) managers = data.data.out;
					else toast.error(data.data.msg);
				} catch (err) {
					console.log(err);
				}
			})();
	});

	const handleSelected = async (val, key) => {
		if (localStorage.getItem('cadre') === 'user') return toast.info('only managers can add users');
		const user = managers.find((v) => v.email === val);
		if (localStorage.getItem('cadre') === 'manager')
			try {
				const data = rest.addUser({ email: user.email });
				if (!data.data.status) return toast.error((await data).data.msg);
			} catch (err) {
				console.log(err);
				return;
			}
		users.push(user);
		managers.splice(key, 1);
		dispatch(createUser(users));
		setOpen(false);
	};

	const [ password, setPassword ] = useState('');

	const passCheck = async (index) => {
		if (localStorage.getItem('cadre') === 'user') return toast.info('only managers can remove users');
		if (localStorage.getItem('cadre') === 'guest') if (password !== 'g@L') return toast.error('password incorrect');
		if (localStorage.getItem('cadre') === 'manager')
			try {
				const data = await rest.checkPass({ password });
				if (data.data.status) await rest.removeUser({ email: users[index].email });
				else return toast.error('password incorrect');
			} catch (err) {
				console.log(err);
				return toast.error('error getting details try again');
			}
		users.splice(index, 1);
		dispatch(removeUser(users));
	};

	const [ open, setOpen ] = useState(false);
	return (
		<div className="container-fluid p-0">
			{localStorage.getItem('cadre') !== 'user' && (
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
			)}
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
						{localStorage.getItem('cadre') !== 'user' && (
							<Grid.Column computer={2} mobile={3} tablet={2}>
								<Header content="del" />
							</Grid.Column>
						)}
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
							{localStorage.getItem('cadre') !== 'user' && (
								<Grid.Column computer={2} mobile={3} tablet={2}>
									<Popup
										style={{ width: '300px' }}
										position="left center"
										trigger={
											<MdDelete
												style={{ fontSize: '1.75rem', cursor: 'pointer', color: 'red' }}
												onClick={() =>
													localStorage.getItem('cadre') === 'guest' &&
													toast.info('Guest Password is g@L')}
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
							)}
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
