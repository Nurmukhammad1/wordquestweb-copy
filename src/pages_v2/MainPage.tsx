import { Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Footer, Header } from "antd/es/layout/layout";
import React from "react";
import SiderContent from "./SiderContent";

export default function MainPage() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
          <Header style={styles.header}>Header</Header>
          <Layout style={styles.container}>
            <Content style={styles.sider}><SiderContent/></Content>
          </Layout>
          <Footer style={styles.footer}>Footer</Footer>
        </Layout>
      );
}

const styles = {
    header: {
      background: '#ebf0f5',
      height: '5vh',
      border: '1px solid #dcdcdc',
      margin: '10px',
    },
    sider: {
        background: '#ebf0f5',
        border: '1px solid #dcdcdc',
        margin: '10px',
      },
      content: {
        background: '#ebf0f5',
        border: '1px solid #dcdcdc',
        margin: '10px',
        marginLeft:'0px',
      },
    container: {
      background: '#f0f2f5',
      marginLeft: '10px',
      marginRight: '10px',
      border: '1px solid #dcdcdc',
    },
    footer: {
      background: '#ebf0f5',
      margin: '10px',
      height: '5vh',
      border: '1px solid #dcdcdc',
    },
  };
