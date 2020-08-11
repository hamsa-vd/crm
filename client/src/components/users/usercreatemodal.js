import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Form, Modal } from 'semantic-ui-react';
import { createUser } from '../../redux/actions';
import rest from '../../rest.service';
import { toast } from 'react-toastify';
function UserCreateModal() {
	const [ open, setOpen ] = useState(false);
	const users = useSelector((state) => state.users);
	const [ user, setUser ] = useState({ email: '', name: '' });
	const dispatch = useDispatch();
	const CreateUser = async () => {
		if (localStorage.getItem('cadre') === 'manager')
			try {
				const data = await rest.createUser(user);
				if (!data.data.status) return toast.error(data.data.msg);
			} catch (err) {
				console.log(err);
				return;
			}
		users.push(user);
		dispatch(createUser(users));
		toast.info('password with activation link is sent to email which can be changed using forgot password');
		setOpen(false);
	};
	return (
		<React.Fragment>
			<Modal
				onClose={() => setOpen(false)}
				onOpen={() => setOpen(true)}
				open={open}
				dimmer="blurring"
				trigger={<Button content="create a user" positive />}
				style={{ position: 'relative', height: 'unset' }}
			>
				<Modal.Header>create a user</Modal.Header>
				<Modal.Content scrolling>
					<Modal.Description>
						<Form onSubmit={CreateUser}>
							<Form.Input
								fluid
								required
								label="email"
								placeholder="Enter email"
								type="email"
								onChange={(e, { value }) => setUser((initial) => ({ ...initial, email: value }))}
							/>
							<Form.Input
								fluid
								required
								label="name"
								placeholder="Enter name"
								type="text"
								onChange={(e, { value }) => setUser((initial) => ({ ...initial, name: value }))}
							/>
							<Form.Button type="submit" content="submit" inverted color="green" />
						</Form>
					</Modal.Description>
				</Modal.Content>
				<Modal.Actions>
					<Button content="close" negative basic onClick={() => setOpen(false)} />
				</Modal.Actions>
			</Modal>
		</React.Fragment>
	);
}

export default UserCreateModal;
