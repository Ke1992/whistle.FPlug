//组件
import React, {
	Component
} from 'react';

class NavListItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			item: {
				title,
				minTitle,
				url,
				icon
			}
		} = this.props;

		return (
			<li>
				<span className='ellipsis'><i></i><i></i><i></i></span>
				<a href={url} title={title}>
					<span className={['icon', icon].join(' ')}></span>
					<span className='title'>{title}</span>
					<span className='min-title'>{minTitle}</span>
				</a>
			</li>
		);
	}
}

export default NavListItem;