//样式
import style from './line.scss';
//组件
import React, {
	Component
} from 'react';

class Line extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className='line'></div>
		);
	}
}

export default Line;