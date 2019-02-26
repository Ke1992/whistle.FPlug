//样式
import style from './aicheck.scss';
//组件
import React, {
	Component
} from 'react';
import AiCheckItem from './aicheck_item';

/**
 * id
 * name
 * data					数据源
 * 	 text				文案
 *   param 				传递到后台的参数
 * 	 checked 			是否默认选中
 * 	 
 * type 				类型: checkbox、radio
 * skin					皮肤: fill(原始)、empty(空心)
 * shape				外形: square(方形)、circular(圆形)
 * inner 				填充: point(圆点)、hook(勾)、dot(方点)
 * disabled				是否是不可点击的状态
 * defaultValue			默认选中值
 * checkFunc 			选中事件
 * noCheckFunc 			取消选中事件
 */
class AiCheck extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: props.data,
			result: props.defaultValue
		};

		this.valid = this.valid.bind(this);
		this.empty = this.empty.bind(this);
		this.getData = this.getData.bind(this);
		this.changeCheckedStatus = this.changeCheckedStatus.bind(this);
	}

	//render之前的钩子函数
	componentWillMount() {
		this.props.init(this);
	}

	//校验函数
	valid() {
		const {
			name
		} = this.props;
		const valid = !!this.state.result.length;

		return {
			valid,
			msg: '请选择' + name
		}
	}

	//清空数据函数
	empty() {
		this.setState(state => ({
			result: []
		}));
	}

	//重置状态
	reset() {
		this.setState(state => ({
			result: this.props.defaultValue
		}));
	}

	//获取数据函数
	getData() {
		const value = this.state.result;

		return {
			id: this.props.id,
			value: this.props.type == 'radio' ? value[0] : value
		}
	}

	//改变选中状态
	changeCheckedStatus(value, text, checked) {
		const {
			id,
			type
		} = this.props;
		const param = {
			id,
			text,
			value
		};
		let result = this.state.result;

		if (type == 'radio') {
			//清空数据
			result = [];
			//新增数据
			result.push(value);
		} else {
			if (checked) {
				//新增数据
				result.push(value);
			} else {
				//移除对应数据
				result.splice(result.indexOf(value), 1);
			}
		}

		//更新组件
		this.setState(state => ({
			result
		}), () => {
			if (type == 'radio') {
				//调用选中事件
				this.props.checkFunc(param);
			} else {
				//调用对应事件
				checked ? this.props.checkFunc(param) : this.props.noCheckFunc(param);
			}
		});
	}

	render() {
		const {
			skin,
			shape,
			inner,
			disabled,
			checkFunc,
			noCheckFunc
		} = this.props;
		const {
			data,
			result
		} = this.state;

		return (
			<span className='ai-check-wrap'>
				<span></span>
				{
					data.map((item, index) => {
						const {
							value
						} = item;

						return <AiCheckItem key={index}
									skin={skin}
									shape={shape}
									inner={inner}
									value={value}
									text={item.text}
									disabled={disabled}
									checked={result.indexOf(value) >= 0}
									changeCheckedStatus={this.changeCheckedStatus} />
					})
				}
			</span>
		);
	}
}

AiCheck.defaultProps = {
	data: [],
	skin: 'fill',
	type: 'radio',
	inner: 'hook',
	shape: 'square',
	disabled: false,
	defaultValue: [],
	checkFunc: function() {},
	noCheckFunc: function() {}
}

export default AiCheck;