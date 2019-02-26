//样式
import style from './container.scss';
//组件
import React, {
	Component
} from 'react';
import ContainerTop from './container_top';

class Container extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fold: true
		};

		this.foldContainer = this.foldContainer.bind(this);
	}

	foldContainer() {
		this.setState(state => ({
			fold: !state.fold
		}));
	}

	render() {
		const {
			children
		} = this.props;
		const {
			fold
		} = this.state;
		
		return (
			<div className={['container', 'pb-10', 'mb-40', fold ? '' : 'container-fold'].join(' ')}>
			{
				//TODO:后续思考有没有更好的方案,这样写有点low
				React.Children.map(children, item => {
					//强制为ContainerTop添加属性
					if (item.type === ContainerTop) {
						const props = {
							fold,
							foldContainer: this.foldContainer
						};
						//等价于React.cloneElement函数
						return <item.type {...item.props} {...props}></item.type>
					} else {
						return item;
					}
				})
			}
			</div>
		);
	}
}

export default Container;