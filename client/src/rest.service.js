import Axios from 'axios';

const http = Axios.create({
	baseURL: 'https://hava-crm.herokuapp.com/api',
	headers: {
		Authorization: `Bearer ${localStorage.getItem('token')}`
	}
});

const addUser = (email) => http.put('/adduser', { email });

const createUser = (user) => http.post('/createuser', user);

const removeUser = (email, password) => http.delete('/removeuser', { email });

const getDetails = (user) => http.get('/getdetails');

const createLead = (lead) => http.post('/createlead', lead);

const editLead = (lead) => http.patch('/editlead', lead);

const makeContact = (email) => http.put(`/makecontact/${email}`);

const startService = (service) => http.post('/startservice', service);

const editService = (service) => http.patch('/editservice', service);

const checkPass = (password) => http.post('/checkpass', { password });

const allManagers = () => http.get('/allmanagers');

export default {
	addUser,
	createUser,
	removeUser,
	getDetails,
	createLead,
	editLead,
	makeContact,
	startService,
	editService,
	checkPass,
	allManagers
};
