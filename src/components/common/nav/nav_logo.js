//组件
import React, {
	Component
} from 'react';
//库
import Url from '../../../utils/url';

class NavLogo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			status: window.WEBDATA.plug == 'on' ? 'on' : 'off'
		};

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		const status = this.state.status == 'on' ? 'off' : 'on';

		//发起请求
		Url.switchToggleByType('plug', status).then(result => {
			//包含敏感操作命令
			if (result.code == 0) {
				//设置数据
				this.setState(state => ({
					status
				}));
			} else {
				alert(result.msg);
			}
		}).catch(error => {
			alert('切换失败');
			console.error(error);
		});
	}

	render() {
		const {
			status
		} = this.state;

		return (
			<div className='logo'>
				<img onClick={this.handleClick} src={status == 'on' ? require('./images/logo.png') : require('./images/logo_no.png')} />
			</div>
		);
	}
}

export default NavLogo;