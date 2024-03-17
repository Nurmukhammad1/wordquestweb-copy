import React from "react";
import { Layout } from "antd";
import AppContent from "../components/AppContent";
import AppContext from "../components/AppContext";
import AppWordList from "../components/AppWordList";
import { StrictMode, useState } from "react";
const { Footer, Content, Header, Sider } = Layout;
import WordType from "../types/WordType";
import { wordBuilder } from "../types/WordType";

const MainPage: React.FC = () => {
  const [activeWord, setActiveWord] = useState<WordType>(wordBuilder(0, ""));

  const handleChildValueChange = (word: WordType) => {
    setActiveWord(word);
  };

  return (
    <StrictMode>
      <Layout style={{ backgroundColor: "#646567", height: "100vh" }}>
        <Layout style={{ height: "100vh", width: "70%", alignSelf: "center" }}>
          <Header style={styles.header}>WORD JUNGLE</Header>
          <Layout style={{ backgroundColor: "#A5D7D4" }}>
            <Sider style={styles.sider}>
              <AppWordList onActiveWordChange={handleChildValueChange} />
            </Sider>
            <Layout style={{ alignItems: "flex", backgroundColor: "#A5D7D4" }}>
              <Content style={styles.content1}>
                <AppContent word={activeWord} />
              </Content>
              <Content style={styles.content2}>
                <AppContext word={activeWord} />
              </Content>
            </Layout>
          </Layout>
          <Footer style={styles.footer}> FOOTER </Footer>
        </Layout>
      </Layout>
    </StrictMode>
  );
};

const styles = {
  header: {
    background: "#DEA709",
    fontFamily: "Keania One",
    fontSize: "24px",
    boxShadow: "1 1 15px rgba(0, 0, 0, 0.5)",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  },
  footer: {
    background: "#DEA709",
    boxShadow: "1 1 15px rgba(0, 0, 0, 0.5)",
  },
  sider: {
    background: "#FBF3C5",
    padding: "10px 10px",
    marginTop: "7px",
    marginRight: "7px",
    marginLeft: "14px",
    marginBottom: "7px",
    boxShadow: "-0 0 5px rgba(0, 0, 0, 0.5)",
    borderRadius: 3,
  },
  content1: {
    padding: "10px 10px",
    background: "#FBF3C5",
    height: "80%",
    marginTop: "7px",
    marginRight: "14px",
    boxShadow: "-0 0 5px rgba(0, 0, 0, 0.5)",
    borderRadius: 3,
  },
  content2: {
    padding: "10px 10px",
    background: "#FBF3C5",
    height: "20%",
    marginTop: "7px",
    marginRight: "14px",
    marginBottom: "7px",
    boxShadow: "-0 0 5px rgba(0, 0, 0, 0.5)",
    borderRadius: 3,
  },
};

export default MainPage;