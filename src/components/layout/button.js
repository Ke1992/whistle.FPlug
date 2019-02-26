//样式
import style from './button.scss';
//组件
import React, {
	Component
} from 'react';

/**
 * text				按钮文案
 * type 			按钮类型: jump、search、submit
 */
class Button extends Component {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.props.onClick();
	}

	render() {
		const {
			text,
			type,
			className
		} = this.props;

		return (
			<button className={['btn', 'btn-' + type, className].join(' ')} onClick={this.handleClick}>{text}</button>
		);
	}
}

Button.defaultProps = {
	text: '',
	type: 'jump',
	className: '',
	onClick: () => {}
};

export default Button;