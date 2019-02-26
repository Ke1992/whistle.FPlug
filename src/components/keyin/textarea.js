//样式
import style from './textarea.scss';
//配置
import ValidConfig from '../../../config/valid.config';
//组件
import React, {
	Component
} from 'react';

/**
 * id
 * name
 * regexp: 				自定义正则表达式
 * errmsg: 				错误提示信息
 * format: 				校验格式
 * disabled: 			是否禁止
 * placeholder: 		提示语
 * defaultValue: 		默认值
 */
class Textarea extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: props.defaultValue,
			error: false
		};

		this.valid = this.valid.bind(this);
		this.empty = this.empty.bind(this);
		this.setData = this.setData.bind(this);
		this.getData = this.getData.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	//render之前的钩子函数
	componentWillMount() {
		this.props.init(this);
	}

	//校验函数
	valid() {
		const {
			name,
			errmsg,
			regexp,
			disabled
		} = this.props;
		const value = this.state.value;
		const format = ValidConfig.rule[this.props.format] || ValidConfig.rule.empty;

		//禁止状态 && 有默认值
		if (disabled && value) {
			return {
				valid: true,
				msg: ''
			}
		}

		//获取结果
		const result = ValidConfig.func[format](value, regexp);

		//重置输入框error状态
		this.setState(state => ({
			error: !result.valid
		}));

		return {
			valid: result.valid,
			msg: errmsg || (name + result.msg)
		}
	}

	//清空数据
	empty() {
		this.setState(state => ({
			value: ''
		}));
	}

	//设置数据
	setData(value) {
		return new Promise(resolve => {
			this.setState(state => ({
				value
			}), () => {
				resolve();
			});
		});
	}

	//获取数据函数
	getData() {
		return {
			id: this.props.id,
			value: this.state.value
		}
	}

	handleChange(event) {
		const value = event.target.value;
		this.setState(state => ({
			value
		}));
	}

	render() {
		const {
			id,
			disabled,
			placeholder
		} = this.props;
		const {
			value,
			error
		} = this.state;

		return (
			<textarea id={id}
				type='text'
				value={value}
				disabled={disabled}
				placeholder={placeholder}
				onChange={this.handleChange}
				className={error ? 'error' : ''}>
			</textarea>
		);
	}
}

Textarea.defaultProps = {
	format: 'empty', //校验格式
	disabled: false,
	defaultValue: ''
};

export default Textarea;