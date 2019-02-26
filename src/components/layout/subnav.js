//样式
import style from './subnav.scss';
//组件
import React, {
	Component
} from 'react';

/**
 * title			副标题文案
 */
class Subnav extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			title
		} = this.props;

		return (
			<div className='subnav'>
				<h1>{title}</h1>
			</div>
		);
	}
}

export default Subnav;