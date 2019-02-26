//样式
import style from './emphasize.scss';
//组件
import React, {
	Component
} from 'react';

class Emphasize extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			tips
		} = this.props;

		return (
			<span className='emphasize'>
				<em className='icon-info-circle'></em>
				{tips}
			</span>
		);
	}
}

export default Emphasize;