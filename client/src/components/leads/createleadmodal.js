import React, { useState } from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { createLead } from '../../redux/actions';
import rest from '../../rest.service';
function CreateLeadModal() {
	const [ open, setOpen ] = useState(false);
	const [ lead, setLead ] = useState({ email: '', name: '', status: '' });
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
	const handleSubmit = async () => {
		leads.push(lead);
		if (localStorage.getItem('cadre') === 'manager')
			try {
				const data = await rest.createLead(lead);
				console.log(data.data.out);
			} catch (error) {
				console.log(error);
			}
		dispatch(createLead(leads));
		setLead((initial) => ({ email: '', name: '', status: '' }));
		setOpen(false);
	};
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
						<Form onSubmit={handleSubmit}>
							<Form.Input
								fluid
								required
								name="email"
								label="email"
								placeholder="Enter email"
								type="email"
								onChange={(e, { value }) => setLead((initial) => ({ ...initial, email: value }))}
							/>
							<Form.Input
								fluid
								required
								name="name"
								label="name"
								placeholder="Enter name"
								type="text"
								onChange={(e, { value }) => setLead((initial) => ({ ...initial, name: value }))}
							/>
							<Form.Select
								required
								search
								fluid
								name="status"
								label="status"
								options={options}
								placeholder="status"
								onChange={(e, { value }) => setLead((initial) => ({ ...initial, status: value }))}
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

export default CreateLeadModal;
