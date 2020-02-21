// 样式
import React, {
    Component,
    ReactNode,
} from 'react';
// 组件
import SideBarLogo from './SidebarLogo';
import SideBarList from './SideBarList';
// 样式
require('./Sidebar.scss');

export default class SideBar extends Component<{}, {}> {
    public render(): ReactNode {
        return (
            <div className='sidebar'>
                <SideBarLogo />
                <SideBarList />
            </div>
        );
    }
}
