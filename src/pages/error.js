//组件
import React from 'react';
import ReactDOM from 'react-dom';
import {
	Main
} from '../components/layout/layout';
import Error from '../components/pages/error/error';

const container = document.getElementById('main');

ReactDOM.render(
	<Main>
		<Error />
	</Main>,
	container
);