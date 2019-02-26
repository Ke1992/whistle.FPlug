//样式
import style from './tips.scss';
//组件
import React, {
	Component
} from 'react';

/**
 * desc 			提示描述
 * title 			提示标题
 */
class Tips extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			desc,
			title
		} = this.props;

		return (
			<div className='tips'>
				<div className='tips-text'>
					<h4 className='tips-title'>{title}</h4>
					<p>{desc}</p>
				</div>
			</div>
		);
	}
}

export default Tips;