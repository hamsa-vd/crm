import React, { useState } from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { startService } from '../../redux/actions';
function StartServiceModal() {
	const [ open, setOpen ] = useState(false);
	const services = useSelector((state) => state.services);
	const dispatch = useDispatch(startService);
	const options = [
		{ key: 'Created', text: 'Created', value: 'Created' },
		{ key: 'Open', text: 'Open', value: 'Open' },
		{ key: 'Released', text: 'Released', value: 'Released' },
		{ key: 'In Process', text: 'In Process', value: 'In Process' },
		{ key: 'Cancelled', text: 'New', value: 'New' },
		{ key: 'Completed', text: 'Completed', value: 'Completed' }
	];
	const modalDefaultStyles = {
		position: 'relative',
		height: 'unset'
	};
	const handleSubmit = () => {};
	return (
		<React.Fragment>
			<Modal
				onClose={() => setOpen(false)}
				onOpen={() => setOpen(true)}
				open={open}
				dimmer="blurring"
				trigger={<Button content="create a lead" inverted color="violet" />}
				style={modalDefaultStyles}
			>
				<Modal.Header>create a lead</Modal.Header>
				<Modal.Content scrolling>
					<Modal.Description>
						<Form>
							<Form.Input fluid required label="customer" placeholder="Enter email" type="email" />
							<Form.Input fluid required label="service" placeholder="Enter name" type="text" />
							<Form.Select
								required
								search
								fluid
								label="status"
								options={options}
								placeholder="status"
								error={false && { content: 'compulsory' }}
							/>
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

export default StartServiceModal;
