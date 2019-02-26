//组件
import React, {
	Component
} from 'react';

/**
 * count					总页数
 * index					当前页数
 * changePageIndexFunc		页码改变响应函数
 */
class Pagination extends Component {
	constructor(props) {
		super(props);

		this.state = {
			pageNum: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handlePageBtnClick = this.handlePageBtnClick.bind(this);
		this.handleJumpBtnClick = this.handleJumpBtnClick.bind(this);
	}

	handleChange(event) {
		const pageNum = event.target.value;
		this.setState(state => ({
			pageNum
		}));
	}

	//页码按钮事件
	handlePageBtnClick(index) {
		this.props.changePageIndexFunc(index);
	}

	//跳转按钮事件
	handleJumpBtnClick() {
		const {
			count,
			index
		} = this.props;
		const {
			pageNum
		} = this.state;

		//数据不能为空
		if (!pageNum) {
			this.props.showDialog('请输入具体的数字');
			return;
		}

		//数据不合法
		if (pageNum < 1 || pageNum > count) {
			this.props.showDialog('请输入 1到' + count + ' 之间的数字');
			return;
		}

		//页码和当前相同直接返回
		if (pageNum == index) {
			return;
		}

		//跳转
		this.handlePageBtnClick(pageNum);
		//清空数据
		this.setState(state => ({
			pageNum: ''
		}));
	}

	render() {
		const {
			count,
			index
		} = this.props;
		const {
			pageNum
		} = this.state;
		//起点页码值
		const initialNum = Math.ceil((index - 5) / 5) * 5;

		return (
			<div className='ai-table-pagination'>
				{count > 1 && <div className='count'>共<span>{count}</span>页</div>}

				<ul>
					{index > 5 && <li className='prev' onClick={()=>{this.handlePageBtnClick(initialNum-4)}}></li>}
					{
						[1, 2, 3, 4, 5].map(item => {
							const num = item + initialNum;

							if (num > count) {
								return '';
							} else if (num == index) {
								return <li key={num} className='current'>{num}</li>
							} else {
								return <li key={num} onClick={()=>{this.handlePageBtnClick(num)}}>{num}</li>
							}
						})
					}
					{count > 5 && index <= Math.ceil((count - 5) / 5) * 5 &&  <li className='next' onClick={()=>{this.handlePageBtnClick(initialNum+6)}}></li>}
				</ul>

				{count > 5 && <input placeholder='页数' value={pageNum} onChange={this.handleChange} />}
				{count > 5 && <button className='jump' onClick={this.handleJumpBtnClick}>跳转</button>}
			</div>
		);
	}
}

Pagination.defaultProps = {
	count: 0,
	index: 1
}

export default Pagination;