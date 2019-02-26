//组件
import React, {
	Component
} from 'react';
import NavListItem from './nav_list_item';

class NavList extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			menu: {
				data: list
			}
		} = this.props;

		return (
			<ul>
				{
					list.map((item, index) =>{
						return <NavListItem item={item} key={index}/>
					})
				}
			</ul>
		);
	}
}

export default NavList;