import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Form, Modal } from 'semantic-ui-react';

function UserCreateModal() {
	const [ open, setOpen ] = useState(false);
	const handleSubmit = (e) => console.log(e);
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
						<Form>
							<Form.Input fluid required label="email" placeholder="Enter email" type="email" />
							<Form.Input fluid required label="name" placeholder="Enter name" type="text" />
							<Form.Button type="submit" content="submit" onClick={handleSubmit} inverted color="green" />
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
