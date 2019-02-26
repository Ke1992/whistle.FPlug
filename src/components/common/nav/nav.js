//样式
import style from './style.scss';
//组件
import React, {
	Component
} from 'react';
import NavLogo from './nav_logo';
import NavList from './nav_list';

class Nav extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			config: {
				logo,
				menu
			}
		} = this.props;

		return (
			<div className='sidebar'>
				<NavLogo logo={logo} />
				<NavList menu={menu} />
			</div>
		);
	}
}

export default Nav;