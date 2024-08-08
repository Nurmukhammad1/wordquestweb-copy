import { Col, Collapse, Layout, Row, Space, Tooltip } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import Iterable from "../../types/Iterable";
import GoalsList from "./goals/GoalsList";
import CardsList from "./steps/StepsList";
import { iterableBuilder } from "../../types/IterableClass";
import CardMarkDownBasic from "./card/CardMarkDownBasic";
import CardMarkDownLangLearn from "./card/CardMarkDownLangLearn";
import CardVideoStream from "./card/CardVideoStream";
import { PlusSquareFilled } from "@ant-design/icons";
import AddThemeModel from "./goals/AddThemeModel";
import Config from "../../Config";
import { useToken } from "../../hooks/useToken";


const { Panel } = Collapse;

export default function SetSteps() {
  const [_theme, setTheme] = useState<Iterable | null>(null);
  const [_card, setCard] = useState<Iterable | null>(null);
  const [_reloadCards, setReloadCards] = useState(false);
  const [_reloadGoals, setReloadGoals] = useState(false);
  const [_isModalOpen, setIsModalOpen] = useState(false);
  const [_token] = useToken();
  const [_blockThemeChange, setBlockThemeChange] = useState(false);
  const [_themeType, setThemeType] = useState("");

  useEffect(() => {
    if (_card != null) {
      setCard(null);
    }
  }, [_theme]);

  const onSaveCard = (item: Iterable) => {
    let path = `api/cards/${_theme?.getId()}`;
    axios.post(Config.BACK_SERVER_DOMAIN + path, item, {
      headers: {
        Authorization: _token ? `${_token}` : null,
      },
    }).then(() => {
      setReloadCards(true);
    });
  };


  // функция для удаления карточки
  const onDeleteCard = (cardId: number) => {
    const url = `${Config.BACK_SERVER_DOMAIN}/api/cards/${cardId}`;
    axios.delete(url, {
      headers: {
        Authorization: _token ? `${_token}` : null,
      },
    })
    .then(response => {
      console.log('Card deleted successfully:', response.data);
      setReloadCards(true);
      setCard(null);
    })
    .catch(error => {
      console.error('There was an error deleting the card!', error);
    });
  };


  const getPanelTitle = function () {
    if (_theme != null) {
      let themeTitle = _theme.getTitle();

      let title = "Steps to: ";
      if (themeTitle.length > 20) {
        themeTitle = themeTitle.substring(0, 20) + "...";
      }

      return title + themeTitle;
    } else {
      return "Steps";
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setReloadGoals(true);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setReloadGoals(false);
  };

  const createNewCard = () => {
    setCard(iterableBuilder(0, "", "", ""));
  };

  return (
    <Layout
      style={{
        backgroundColor: "rgba(255, 255, 255, 0)",
      }}
    >
      <Row>
        <Col span={10}>
          <Collapse style={{ ...defaultStyle }}>
            <Panel key="1" header="Goals">
              <Space direction="vertical">
                <>
                  <AddThemeModel
                    openModal={_isModalOpen}
                    closeModalCallback={closeModal}
                  />
                  <Tooltip title="add a goal" trigger="hover">
                    <PlusSquareFilled onClick={openModal} />
                  </Tooltip>
                </>
                <GoalsList
                  onListReloaded={() => setReloadGoals(false)}
                  reloadList={_reloadGoals}
                  onItemSelected={(item: Iterable | null) => {
                    if (!_blockThemeChange) {
                      setTheme(item);
                      setThemeType(item?.getDetails().type);
                    } else {
                      alert(
                        "save & close step being edited before selecting another goal "
                      );
                    }
                  }}
                />
              </Space>
            </Panel>
            <Panel key="2" header={getPanelTitle()}>
              <Space direction="vertical">
                {_theme == null ? (
                  <p>set a goal first</p>
                ) : (
                  <>
                    <Space direction="horizontal">
                      <Tooltip title="add a new card" trigger="hover">
                        <PlusSquareFilled onClick={createNewCard} />
                      </Tooltip>
                    </Space>
                    <CardsList
                      onItemSelected={(item: Iterable) => {
                        setCard(item);
                      }}
                      forceListReload={_reloadCards}
                      theme={_theme}
                      onListReloaded={() => setReloadCards(false)}
                    />
                  </>
                )}
              </Space>
            </Panel>
          </Collapse>
        </Col>
        <Col span={14}>
          {_card != null && (_themeType === "" || _themeType === "Markdown") && (
            <>
              <CardMarkDownBasic
                onEditing={() => setBlockThemeChange(true)}
                onSaveCard={(item: Iterable) => {
                  onSaveCard(item);
                  setReloadCards(true);
                }}
                onCloseCard={() => {
                  setBlockThemeChange(false);
                  setCard(null);
                }}
                card={_card}
                outerStyle={{
                  marginLeft: "15px",
                  height: 400,
                  width: 580,
                }}
              />
            </>
          )}
          {_card != null && (_themeType === "" || _themeType === "VideoStream") && (
            <>
              <CardVideoStream
                onEditing={() => setBlockThemeChange(true)}
                onSaveCard={(item: Iterable) => {
                  onSaveCard(item);
                  setReloadCards(true);
                }}
                onCloseCard={() => {
                  setBlockThemeChange(false);
                  setCard(null);
                }}
                onDeleteCard={() => onDeleteCard(_card.getId())} // добавили метод onDeleteCard
                card={_card}
                outerStyle={{
                  marginLeft: "15px",
                  height: 400,
                  width: 580,
                }}
              />
            </>
          )}
          {_card != null && _themeType === "Learn Language" && (
            <>
              <CardMarkDownLangLearn
                themeId={_theme?.getId()}
                onEditing={() => setBlockThemeChange(true)}
                onSaveCard={(item: Iterable) => {
                  onSaveCard(item);
                  setReloadCards(true);
                }}
                onCloseCard={() => {
                  setBlockThemeChange(false);
                  setCard(null);
                }}
                card={_card}
                outerStyle={{
                  marginLeft: "15px",
                  height: 400,
                  width: 580,
                }}
              />
            </>
          )}
        </Col>
      </Row>
    </Layout>
  );
}

const defaultStyle = {
  width: 430,
  marginLeft: "5px",
  boxShadow: "-0 0 5px rgba(0, 0, 0, 0.5)",
  borderRadius: 2,
  paddingLeft: "2px",
};
