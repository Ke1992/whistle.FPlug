//配置
import Config from '../config/common.config';
//组件
import React from 'react';
import ReactDOM from 'react-dom';
import Nav from './components/common/nav/nav';

const container = document.getElementById('header');

ReactDOM.render(
	<div>
		<Nav config={Config} />
	</div>,
	container
);