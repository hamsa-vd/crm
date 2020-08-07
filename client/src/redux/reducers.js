import actions from './action_types';

const initialState = {
	leads: [],
	contacts: [],
	users: [],
	services: []
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actions.ALL_DETAILS:
			return { ...state, ...action.payload };
		case actions.CREATE_LEAD:
			return { ...state, leads: action.payload.leads };
		case actions.EDIT_LEAD:
			return { ...state, leads: action.payload.leads };
		case actions.CREATE_USER:
			return { ...state, users: action.payload.users };
		case actions.REMOVE_USER:
			return { ...state, users: action.payload.users };
		case actions.MAKE_CONTACT:
			return { ...state, contacts: action.payload.contacts, leads: action.payload.leads };
		case actions.START_SERVICE:
			return { ...state, services: action.payload.services };
		case actions.EDIT_SERVICE:
			return { ...state, services: action.payload.services };
		default:
			return state;
	}
};

export default reducer;
