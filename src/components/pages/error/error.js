//样式
import style from './style.scss';
//组件
import React, {
	Component
} from 'react';

class Error extends Component {
	constructor(props) {
		super();
	}

	render() {
		//TODO:后面考虑一下将空格和\n完美显示出来
		//处理一下错误信息，将\n替换成<br/>换行
		let errorInfoArr = decodeURI(window.WEBDATA).split('\n');

		return (
			<div>
				<img className='error-img' src={require('./images/404.png')} />
				<h1 className='error-title'>抱歉，这个页面已经被外星人绑架了</h1>
				{
					errorInfoArr.map((item, index) => {
						return <div className='error-tips' key={index}>{item}</div>;
					})
				}
			</div>
		);
	}
}

export default Error;