//样式
import style from './style.scss';
//组件
import React, {
	Component
} from 'react'
import FooterItem from './footer_item'

class Footer extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			config: {
				footer: {
					data: list
				}
			}
		} = this.props;
		
		return (
			<div className="footer">
				<p>
					{
						list.map((item, index) => {
							return <FooterItem item={item} key={index}/>;
						})
					}
				</p>
			</div>
		);
	}
}

export default Footer;