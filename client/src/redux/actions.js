import actions from './action_types';

const allDetails = (data) => ({
	type: actions.ALL_DETAILS,
	payload: data
});

const createUser = (users) => ({
	type: actions.CREATE_USER,
	payload: { users }
});

const removeUser = (users) => ({
	type: actions.REMOVE_USER,
	payload: { users }
});

const createLead = (leads) => ({
	type: actions.CREATE_LEAD,
	payload: { leads }
});

const editLead = (leads) => ({
	type: actions.EDIT_LEAD,
	payload: { leads }
});

const makeContact = ({ contacts, leads }) => ({
	type: actions.MAKE_CONTACT,
	payload: { contacts, leads }
});

const startService = (services) => ({
	type: actions.START_SERVICE,
	payload: { services }
});

const editService = (services) => ({
	type: actions.EDIT_SERVICE,
	payload: { services }
});

export default { allDetails, createUser, removeUser, createLead, editLead, makeContact, startService, editService };
