//样式
import style from './style.scss';
//组件
import React, {
	Component
} from 'react';
import ToolItem from './tool_item';

class Tool extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			config: {
				tool: {
					data: list
				}
			}
		} = this.props;

		return (
			<div className='tool'>
				{
					list.map(item => {
						return <ToolItem item={item} key={item.key}/>
					})
				}
			</div>
		);
	}
}

export default Tool;