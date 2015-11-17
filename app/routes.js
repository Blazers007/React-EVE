import React 			from 'react';
import {Route} 			from 'react-router';
import App 				from './components/App';
import Home 			from './components/Home';
import AddCharacter 	from './components/AddCharacter';
import News 			from './components/News';

export default (
	<Route component={App}>
		<Route path='/' component={Home} />
		<Route path='/add' component={AddCharacter} />
		<Route path='/stats' component={News} />
	</Route>
);