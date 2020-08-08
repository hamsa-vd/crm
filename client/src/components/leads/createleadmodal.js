import React, { useState } from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { createLead } from '../../redux/actions';
function CreateLeadModal() {
	const [ open, setOpen ] = useState(false);
	const leads = useSelector((state) => state.leads);
	const dispatch = useDispatch(createLead);
	const options = [
		{ key: 'new', text: 'New', value: 'New' },
		{ key: 'Contacted', text: 'Contacted', value: 'Contacted' },
		{ key: 'Qualified', text: 'Qualified', value: 'Qualified' },
		{ key: 'Lost', text: 'Lost', value: 'Lost' },
		{ key: 'Cancelled', text: 'New', value: 'New' },
		{ key: 'Confirmed', text: 'Confirmed', value: 'Confirmed' }
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
							<Form.Input fluid required label="email" placeholder="Enter email" type="email" />
							<Form.Input fluid required label="name" placeholder="Enter name" type="text" />
							<Form.Select
								required
								search
								fluid
								label="status"
								options={options}
								placeholder="status"
								error={false && { content: 'hajksj' }}
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

export default CreateLeadModal;
