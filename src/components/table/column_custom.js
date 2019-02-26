//组件
import React, {
	Component
} from 'react';

class ColumnCustom extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			data,
			text,
			field,
			isThead
		} = this.props;

		if (isThead) {
			return (
				<th>{text}</th>
			);
		} else {
			return (
				<td>
					{this.props.init(field, data)}
				</td>
			);
		}
	}
}

ColumnCustom.defaultProps = {
	data: {},
	isThead: true
};

export default ColumnCustom;