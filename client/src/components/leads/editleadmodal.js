import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button, Form } from 'semantic-ui-react';
import { editLead } from '../../redux/actions';
function EditLeadModal(props) {
	const [ open, setOpen ] = useState(false);
	const { leads } = useSelector((state) => ({ leads: state.leads }));
	const dispatch = useDispatch();
	const options = [
		{ key: 'new', text: 'New', value: 'New' },
		{ key: 'Contacted', text: 'Contacted', value: 'Contacted' },
		{ key: 'Qualified', text: 'Qualified', value: 'Qualified' },
		{ key: 'Lost', text: 'Lost', value: 'Lost' },
		{ key: 'Cancelled', text: 'Cancelled', value: 'Cancelled' },
		{ key: 'Confirmed', text: 'Confirmed', value: 'Confirmed' }
	];

	const [ val, setVal ] = useState('');

	const editSelectSubmit = () => {
		leads.map((v) => {
			if (v.email === props.email) {
				v.status = val;
			}
			return v;
		});
		dispatch(editLead(leads));
		setVal('');
		setOpen(false);
	};

	return (
		<React.Fragment>
			<Modal
				onClose={() => setOpen(false)}
				onOpen={() => setOpen(true)}
				open={open}
				trigger={<Button inverted content="edit status" color="green" icon="edit" />}
				style={{ position: 'relative', height: 'unset' }}
				closeIcon
			>
				<Modal.Header>Edit Status</Modal.Header>
				<Modal.Content>
					<Modal.Description>
						<Form.Select
							fluid
							label="status"
							placeholder={leads.find((v) => v.email === props.email).status}
							options={options}
							onChange={(e, { value }) => setVal(value)}
						/>
						<Form.Button
							content="edit"
							type="submit"
							icon="edit"
							inverted
							color="green"
							className="m-3"
							onClick={() => editSelectSubmit()}
						/>
					</Modal.Description>
				</Modal.Content>
				<Modal.Actions>
					<Button content="close" onClick={() => setOpen(false)} inverted color="red" />
				</Modal.Actions>
			</Modal>
		</React.Fragment>
	);
}

export default EditLeadModal;
