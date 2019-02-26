//样式
import style from './main.scss';
//组件
import React, {
	Component
} from 'react';

class Main extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			children
		} = this.props;

		return (
			<div className='main'>
				{children}
			</div>
		);
	}
}

export default Main;