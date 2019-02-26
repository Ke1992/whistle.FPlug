//组件
import React, {
	Component
} from 'react';

/**
 * show			是否展示加载loading
 */
class Loading extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			show
		} = this.props;

		return (
			<div className={['ai-table-loading', show ? '' : 'hide'].join(' ')}>
				<img src={require('./images/loading.gif')} />
				<div>加载中...</div>
			</div>
		);
	}
}

Loading.defaultProps = {
	show: false
}

export default Loading;