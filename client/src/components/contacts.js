import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

function Contacts() {
	const contacts = useSelector((state) => state.contacts);
	return (
		<div className="container p-3">
			{contacts.length ? (
				<Grid celled columns={3}>
					<Grid.Row columns="equal" textAlign="center">
						<Grid.Column width={3} only="computer">
							{' '}
							<Header>index</Header>
						</Grid.Column>
						{Object.keys(contacts[0]).map((v, index) => (
							<Grid.Column key={index}>
								<Header>{v}</Header>
							</Grid.Column>
						))}
					</Grid.Row>
					{contacts.map((obj, idx) => (
						<Grid.Row key={idx} columns="equal" textAlign="center">
							<Grid.Column key={idx} width={3} only="computer">
								{idx}
							</Grid.Column>
							{Object.keys(obj).map((v, index) => <Grid.Column key={index}>{obj[v]}</Grid.Column>)}
						</Grid.Row>
					))}
				</Grid>
			) : (
				<Header as="h1" color="orange">
					No contacts available. Make a contact to view
				</Header>
			)}
		</div>
	);
}

export default Contacts;
