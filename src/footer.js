//配置
import Config from '../config/common.config';
//组件
import React from 'react';
import ReactDOM from 'react-dom';
import Footer from './components/common/footer/footer';

const container = document.getElementById('footer');

ReactDOM.render(
	<Footer config={Config} />,
	container
);