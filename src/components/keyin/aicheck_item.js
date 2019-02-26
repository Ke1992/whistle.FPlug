//组件
import React, {
	Component
} from 'react';

/**
 * text					文案
 * skin					皮肤: fill(原始)、empty(空心)
 * value				对应数据值
 * shape				外形: square(方形)、circular(圆形)
 * inner 				填充: point(圆点)、hook(勾)、dot(方点)
 * checked 				是否选中
 * disabled				是否是不可点击的状态
 */
class AiCheckItem extends Component {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		const {
			text,
			value,
			checked,
			disabled
		} = this.props;

		if (disabled) {
			return;
		}

		//调用父组件
		this.props.changeCheckedStatus(value, text, !checked);
	}

	render() {
		const {
			text,
			skin,
			shape,
			inner,
			checked,
			disabled
		} = this.props;

		return (
			<span className={['ai-check-span', disabled ? 'disabled' : ''].join(' ')}>
				<i className={[shape, checked ? inner : '', checked ? skin : ''].join(' ')} onClick={this.handleClick}></i>
				<span>{text}</span>
			</span>
		);
	}
}

export default AiCheckItem;