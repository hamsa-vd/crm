import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Login from './components/login';
import Home from './components/home';
import Register from './components/register';
import Forgot from './components/forgot';
import Activate from './components/activate';
import Passchange from './components/passchnage';
import Dashboard from './components/dashboard';
import { Provider } from 'react-redux';
import store from './redux/store';
function App() {
	return (
		<Provider store={store}>
			<Router>
				<div className="App">
					<Switch>
						<Route path="/" exact component={Home} />
						<Route path="/login" component={Login} />
						<Route path="/register" component={Register} />
						<Route path="/activate/:id" exact component={Activate} />
						<Route path="/forgot" component={Forgot} />
						<Route path="/dashboard/:relation" component={Dashboard} />
						<Route path="/passchange/:id" exact component={Passchange} />
					</Switch>
				</div>
			</Router>
		</Provider>
	);
}

export default App;
