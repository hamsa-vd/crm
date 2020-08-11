import React, { useState } from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { startService } from '../../redux/actions';
import rest from '../../rest.service';
import { toast } from 'react-toastify';
function StartServiceModal() {
	const [ open, setOpen ] = useState(false);
	const [ service, setService ] = useState({ name: '', email: '', status: '' });
	const services = useSelector((state) => state.services);
	const dispatch = useDispatch();
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
	const handleSubmit = async () => {
		if (localStorage.getItem('cadre') === 'user') return toast.info('only managers can start a service');
		if (localStorage.getItem('cadre') === 'manager')
			try {
				const data = await rest.startService(service);
				if (!data.data.status) return toast.error(data.data.msg);
			} catch (err) {
				console.log(err);
				return;
			}
		services.push(service);
		dispatch(startService(services));
		setOpen(false);
	};
	return (
		<React.Fragment>
			<Modal
				onClose={() => setOpen(false)}
				onOpen={() => setOpen(true)}
				open={open}
				dimmer="blurring"
				trigger={<Button content="start a service" inverted color="violet" />}
				style={modalDefaultStyles}
			>
				<Modal.Header>start a service</Modal.Header>
				<Modal.Content scrolling>
					<Modal.Description>
						<Form onSubmit={handleSubmit}>
							<Form.Input
								fluid
								required
								label="customer"
								placeholder="Enter email"
								type="email"
								onChange={(e, { value }) => setService((initial) => ({ ...initial, email: value }))}
							/>
							<Form.Input
								fluid
								required
								label="service"
								placeholder="Enter name"
								type="text"
								onChange={(e, { value }) => setService((initial) => ({ ...initial, name: value }))}
							/>
							<Form.Select
								required
								search
								fluid
								label="status"
								options={options}
								placeholder="status"
								onChange={(e, { value }) => setService((initial) => ({ ...initial, status: value }))}
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

export default StartServiceModal;
