import React, { useState } from 'react';
import { Breadcrumb, Button, Layout, Menu, theme } from 'antd';

import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
  } from '@ant-design/icons';
import { Footer } from 'antd/es/layout/layout';
import Link from 'next/link';


const { Header, Content, Sider } = Layout;


const BaseLayout: React.FC = () => {
    const items = [
        {key: "home" , label: <Link href={"/"}>Home</Link>},
        {key: "series" , label: <Link href={"/series"}>Series</Link>}
      ]
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  
  return (
    <Layout>
        <Header > <Button 
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
                marginLeft: '-50px',
                height: 64,
                width: 64,
                color: '#fff'
            }}
          /></Header>
<Layout hasSider>

<Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['home']}
          items={items}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div
            style={{
              padding: 24,
              textAlign: 'center',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <p>long content</p>
            {
              // indicates very long content
              Array.from({ length: 100 }, (_, index) => (
                <React.Fragment key={index}>
                  {index % 20 === 0 && index ? 'more' : '...'}
                  <br />
                </React.Fragment>
              ))
            }
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
    </Layout>
  );
};

export default BaseLayout;