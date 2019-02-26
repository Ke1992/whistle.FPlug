//组件
import React, {
	Component
} from 'react';

/**
 * data				数据
 * text				thead对应文案
 * field 			数据对应的key值
 * isThead			是否是thead
 */
class Column extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		const {
			data,
			text,
			field,
			align,
			isThead
		} = this.props;

		const content = data[field];

		if (isThead) {
			return (
				<th>{text}</th>
			);
		} else {
			return (
				<td className={align}>{content}</td>
			);
		}
	}
}

Column.defaultProps = {
	data: {},
	align: '',
	isThead: true
};

export default Column;