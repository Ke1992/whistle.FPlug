//样式
import style from './style.scss';
//组件
import React, {
	Component
} from 'react';
import Column from './column';
import Loading from './loading';
import Dialog from '../layout/dialog';
import Pagination from './pagination';
import ColumnCustom from './column_custom';
//库
import Url from '../../utils/url';

/**
 * url					数据请求url
 * init 				初始化函数
 * data					初始数据源,有则不会发请求,直接使用data来进行数据渲染
 * index 				当前页码							(从1开始计数,默认是1)
 * limit 				每页显示数量						(默认是15)
 * params				额外请求参数
 * checkbox				是否包含全选框
 * className			自定义class
 * indexParamName 		请求参数中页码的字段名				(默认是index)
 * limitParamName 		请求参数中每页显示数量的字段名		(默认是limit)
 * 
 * 对外暴露的方法：
 * 1、reset				重置table的参数
 * 2、fresh				刷新当前列表
 * 3、getCheckedData		获取所有选择对应的数据
 */
//TODO:写的不太好，抽时间仔细看下，其中自定义单元格这里设计的感觉不太好
class Table extends Component {
	constructor(props) {
		super(props);

		this.state = {
			dialog: null,
			count: props.data ? props.data.length : 0,
			...(Object.assign({
				url: '',
				data: [],
				index: 1,
				limit: 15,
				params: {},
				loading: false, //是否加载中
				checkedArr: [],
				checkbox: false,
				indexParamName: 'index',
				limitParamName: 'limit'
			}, props))
		};

		//绑定this
		this.reset = this.reset.bind(this);
		this.fresh = this.fresh.bind(this);
		this.showDialog = this.showDialog.bind(this);
		this.showLoading = this.showLoading.bind(this);
		this.requestData = this.requestData.bind(this);
		this.checkBoxFunc = this.checkBoxFunc.bind(this);
		this.addDialogToState = this.addDialogToState.bind(this);
	}

	//render之前的钩子函数
	componentWillMount() {
		this.props.init(this);

		//进行数据请求
		this.requestData(this.state.index);
	}

	//重置table
	reset(config) {
		const result = Object.assign({
			url: '',
			data: [],
			index: 1,
			limit: 15,
			params: {},
			loading: false, //是否加载中
			checkedArr: [],
			checkbox: false,
			indexParamName: 'index',
			limitParamName: 'limit'
		}, config);

		//重置相关数据
		result.url && (result.data = []);
		result.count = result.url ? 0 : result.data.length;

		this.setState(state => result, () => {
			this.requestData(this.state.index);
		});
	}

	//刷新当前列表
	fresh() {
		this.requestData(this.state.index);
	}

	//显示对话框
	showDialog(msg) {
		this.state.dialog.show({
			content: msg
		});
	}

	//显示loading
	showLoading() {
		this.setState(state => ({
			loading: true
		}));
	}

	//数据请求函数
	requestData(index) {
		const {
			url,
			limit,
			params,
			loading,
			indexParamName,
			limitParamName
		} = this.state;

		//没有配置url，直接返回
		if (!url) {
			this.setState(state => ({
				index,
				checkedArr: [],
				loading: false
			}));
			return;
		}

		//还在加载中，直接返回
		if (loading) {
			return;
		}

		//设置加载中
		this.setState(state => ({
			loading: true
		}), () => {
			//发起请求
			window.fetch(Url.formatUrlPath(url, {
				...params,
				[indexParamName]: index,
				[limitParamName]: limit
			})).then(response => {
				return response.json();
			}).then(result => {
				//查询成功
				if (result.errorCode == 0) {
					const {
						count,
						list: data
					} = result.data;

					this.setState(state => ({
						data,
						count,
						index,
						checkedArr: [],
						loading: false
					}));
				} else {
					//查询失败，设置加载结束
					this.setState(state => ({
						loading: false
					}));
					this.showDialog('查询数据失败');
				}
			}).catch(error => {
				//获取数据失败，设置加载结束
				this.setState(state => ({
					loading: false
				}));
				this.showDialog('查询数据失败');
			});
		});
	}

	//选择框的点击事件
	checkBoxFunc(index) {
		let {
			limit,
			checkedArr
		} = this.state;

		if (index) {
			//单选事件
			if (checkedArr.indexOf(index) >= 0) {
				checkedArr = checkedArr.filter(item => {
					return item != index;
				});
			} else {
				checkedArr.push(index);
			}
		} else {
			//全选事件
			if (!checkedArr.length) {
				for (let i = 0; i < limit; i++) {
					checkedArr.indexOf('' + i) < 0 && checkedArr.push('' + i);
				}
			} else {
				checkedArr = [];
			}
		}

		this.setState(state => ({
			checkedArr
		}));
	}

	//将弹框对象保存到state中去
	addDialogToState(item) {
		this.state.dialog = item;
	}

	//获取选择的对应的所有数据
	getCheckedData() {
		const {
			url,
			data,
			index,
			limit,
			checkedArr
		} = this.state;
		const result = [];

		//遍历对应数据，获取最终的数据
		(url ? data : data.slice((index - 1) * limit, index * limit)).forEach((item, index) => {
			checkedArr.indexOf('' + index) >= 0 && result.push(item);
		});

		return result;
	}

	render() {
		const {
			children,
			className
		} = this.props;
		const {
			url,
			data,
			count,
			index,
			limit,
			loading,
			checkbox,
			checkedArr
		} = this.state;

		//获取对应数据
		const result = url ? data : data.slice((index - 1) * limit, index * limit);

		return (
			<div className='ai-table-wrap'>
				<table className={['ai-table', className].join(' ')} cellPadding='0' cellSpacing='0'>
					<thead>
						<tr>
							{checkbox && <th><span className={['check', checkedArr.length ? 'on' : ''].join(' ')} onClick={()=>{this.checkBoxFunc()}}></span></th>}
							{children}
						</tr>
					</thead>
					<tbody>
						{
							result.length 
								? 
									result.map((ceil, index) => {
										return (
											<tr key={new Date().getTime() + '_' + index}>
												{checkbox && <td><span className={['check', checkedArr.indexOf('' + index) >= 0 ? 'on' : ''].join(' ')} onClick={()=>{this.checkBoxFunc('' + index)}}></span></td>}
												{
													React.Children.map(children, item => {
														const props = {
															data: ceil,
															isThead: false
														};
														//强制为ContainerTop添加属性
														if (item.type === Column || item.type === ColumnCustom) {
															//等价于React.cloneElement函数
															return <item.type {...item.props} {...props}></item.type>
														}
													})
												}
											</tr>
										)
									})
								:
									<tr>
										<td colSpan={checkbox ? children.length + 1 : children.length}>暂无数据</td>
									</tr>
						}
					</tbody>
				</table>
				<Pagination count={Math.ceil(count / limit)}
					index={index}
					showDialog={this.showDialog}
					changePageIndexFunc={this.requestData}/>
				<Loading show={loading}/>
				<Dialog init={this.addDialogToState}/>
			</div>
		);
	}
}

Table.defaultProps = {
	className: ''
};

export default {
	Table,
	Column,
	ColumnCustom
};

export {
	Table,
	Column,
	ColumnCustom
}