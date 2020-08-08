import actions from './action_types';

export const allDetails = (data) => ({
	type: actions.ALL_DETAILS,
	payload: data
});

export const createUser = (users) => ({
	type: actions.CREATE_USER,
	payload: { users }
});

export const removeUser = (users) => ({
	type: actions.REMOVE_USER,
	payload: { users }
});

export const createLead = (leads) => ({
	type: actions.CREATE_LEAD,
	payload: { leads }
});

export const editLead = (leads) => ({
	type: actions.EDIT_LEAD,
	payload: { leads }
});

export const makeContact = ({ contacts, leads }) => ({
	type: actions.MAKE_CONTACT,
	payload: { contacts, leads }
});

export const startService = (services) => ({
	type: actions.START_SERVICE,
	payload: { services }
});

export const editService = (services) => ({
	type: actions.EDIT_SERVICE,
	payload: { services }
});

export default { allDetails, createUser, removeUser, createLead, editLead, makeContact, startService, editService };
