import React, { useEffect, useState } from "react";
import { Drawer, Space, Button, DrawerProps } from "antd";
import MyWordList from "./MyWordList";
import { Empty_Iterable } from "../types/IterableClass";
import Iterable from "../types/Iterable";
import E_ListSimple from "./elements/E_ListSimple";
import { useUser } from "../hooks/useUser";

interface Props {
  openDrawer: boolean;
  onSaveDrawer: (word: Iterable, context:Iterable) => void;
  onCloseDrawer: () => void;
}

const C_DrawerWord: React.FC<Props> = ({
  openDrawer,
  // onSetActiveWord,
  onSaveDrawer,
  onCloseDrawer,
}) => {
  const [_drawerOpen, setDrawerOpen] = useState(false);
  const [_placement, setPlacement] =
    useState<DrawerProps["placement"]>("right");
  const [_activeWord, setActiveWord] = useState<Iterable>(Empty_Iterable);

  const activeWordChangeListener = (word: Iterable) => {
    setActiveWord(word);
  };

  useEffect(() => {
    if (openDrawer) {
      setDrawerOpen(true);
    }
  }, [openDrawer]);

  const onClose = () => {
    setDrawerOpen(false);
    setActiveWord(Empty_Iterable);
    onCloseDrawer();
  };

  const onSave = () => {
    onSaveDrawer(_activeWord, _activeContext);
    onClose();
  };

  const [doReloadContext, setDoReloadContext] = useState(false);
  const user = useUser();
  const _params = (pageNo: number) => {
    return {
      pageNo: pageNo,
      pageSize: 10,
      sortBy: "",
      direction: "",
      userId: user.userid,
      word: _activeWord.getTitle(),
      filter:"",
    };
  };
  const [_activeContext, setActiveContext] = useState<Iterable>(Empty_Iterable);

  useEffect(() => {
    setDoReloadContext(true);
  }, [_activeWord]);

  return (
    <Drawer
      title="My words to learn"
      placement={_placement}
      width={500}
      onClose={onClose}
      open={_drawerOpen}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={onSave}>
            OK
          </Button>
        </Space>
      }
    >
      <h4>my words</h4>
      <MyWordList onItemSelected={activeWordChangeListener} />
      <div style={{padding:'20px'}}></div>
      <h4>word context</h4>
      {_activeWord && (
        <E_ListSimple
          params={_params}
          onItemSelected={(item: any) => setActiveContext(item)}
          reloadList={doReloadContext}
          onListReloaded={() => {
            setDoReloadContext(false);
          }}
          requestUrl={`api/texts/searchBy`}
        />
      )}
    </Drawer>
  );
};

export default C_DrawerWord;
