//样式
import style from './container_top.scss';
//组件
import React, {
	Component
} from 'react';

/**
 * show				是否展示展开按钮
 * fold 			是否展开
 * title			标题
 */
class ContainerTop extends Component {
	constructor(props) {
		super(props);

		this.foldClickEvent = this.foldClickEvent.bind(this);
	}

	foldClickEvent() {
		//调用父组件函数
		this.props.foldContainer();
	}

	render() {
		const {
			show,
			fold,
			title,
			children
		} = this.props;

		return (
			<div className='top mb-10'>
				<span>{title}</span>
				{
					show && <span className={['open','icon', 'icon-chevron-up', fold ? '' : 'icon-chevron-down'].join(' ')} onClick={this.foldClickEvent}></span>
				}
				{children}
			</div>
		);
	}
}

ContainerTop.defaultProps = {
	show: true
};

export default ContainerTop;