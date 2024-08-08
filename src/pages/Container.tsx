import { Layout, Tabs } from "antd";
import { StrictMode } from "react";
import SetSteps from "./setSteps/SetSteps";
import globaleStyles from "../assets/css/globalStyles";
import { useUser } from "../hooks/useUser";
const { Footer, Header } = Layout;
import { useNavigate } from "react-router-dom";
import { useToken } from "../hooks/useToken";

export default function Container() {
  const user = useUser();
  const [token, setToken] = useToken();
  const navigate = useNavigate();

  const onLogOutClicked = async () => {
    setToken(false);
    navigate("/login");
  };

  return (
    <StrictMode>
      <Layout
        style={{
          backgroundColor: "#f9fff9",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header style={globaleStyles.header}>
          WORD JUNGLE 
          {user && <div>{user.username}</div>}
          {user && <button className="logOut"  onClick={onLogOutClicked}><span>Log Out</span></button>}
          
        </Header>

        <Tabs
          style={{
            flex: 1,
            width: "70%",
            alignSelf: "center",
            border: "1px solid #dce0e3",
            boxShadow: "-0 0 5px rgba(0, 0, 0, 0.5)",
          }}
          tabPosition="top"
          tabBarStyle={{
            fontFamily: "Montserrat",
            height: "30px",
            marginTop: "0px",
            marginLeft: "10px",
            marginRight: "5px",
            marginBottom: "7px",
          }}
          tabBarGutter={20}
          items={[
            {
              label: "set steps",
              key: "2",
              children: <SetSteps />,
            },
          ]}
        ></Tabs>

        <Footer style={globaleStyles.footer}> FOOTER </Footer>
      </Layout>
    </StrictMode>
  );
}
