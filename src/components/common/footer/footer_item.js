//组件
import React, {
	Component
} from 'react'

class FooterItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			item: {
				url,
				name
			}
		} = this.props;

		return (
			<a className="link" href={url} target="view_window">{name}</a>
		);
	}
}

export default FooterItem;