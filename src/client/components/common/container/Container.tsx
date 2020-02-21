// 库
import React, {
    Component,
    ReactNode,
} from 'react';
// 组件
import Footer from '../footer/Footer';
import SideBar from '../sidebar/Sidebar';
// 样式
require('./Container.scss');

export default class Container extends Component<{}, {}> {
    public render(): ReactNode {
        const {
            children,
        } = this.props;

        return (
            <div>
                <SideBar />
                <main className="main">
                    { children }
                </main>
                <Footer />
            </div>
        );
    }
}
