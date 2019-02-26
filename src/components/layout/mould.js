//样式
import style from './mould.scss';
//组件
import React, {
	Component
} from 'react';

/**
 * name 			模块名称
 * size				填充方式：full、full-half、half、mini
 * type 			渲染模式: normal、noname
 */
class Mould extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			name,
			size,
			type,
			children
		} = this.props;

		if (type == 'normal') {
			return (
				<div className={['mould', size].join(' ')}>
					<div className='name'>{name}</div>
					<div className='content'>
						{children}
					</div>
				</div>
			);
		} else {
			return (
				<div className={['mould', size].join(' ')}>
					{children}
				</div>
			);
		}
	}
}

Mould.defaultProps = {
	size: 'full',
	type: 'normal'
}

export default Mould;