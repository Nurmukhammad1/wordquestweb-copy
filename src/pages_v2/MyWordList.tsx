import React, { useEffect, useState } from "react";
import { Row, Col, Tooltip } from "antd";
import Iterable from "../types/Iterable";
import { PlusSquareFilled } from "@ant-design/icons";
import DictionaryModal from "./DictionaryModal";
import { useToken } from "../hooks/useToken";
import { useUser } from "../hooks/useUser";
import E_ListSimple from "./elements/E_ListSimple";

interface CallbackFunction {
  onItemSelected: (item: Iterable) => void;
}

const MyWordList: React.FC<CallbackFunction> = ({ onItemSelected }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doReload, setDoReload] = useState(false);
  const [_token] = useToken();
  const user = useUser();
  const [_userLang, setUserLang] = useState(null);
  const _params = (pageNo: number) =>  {
    return {
      pageNo,
      pageSize:10,
      sortBy: "word",
      direction: "asc",
      langLevel: "all",
      dict: 1,
      id: user.userid,
    }
  }

  useEffect(() => {
   setDoReload(true);
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    setDoReload(false);
  };

  const closeModal = () => {
    setDoReload(true);
    setIsModalOpen(false);
  };

  return (
    <div>
      <Row style={{ paddingBottom: "5px" }}>
        <Col span={12} style={{ textAlign: "left" }}></Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <Tooltip title="browse the dictionary" trigger="hover">
            <PlusSquareFilled onClick={openModal} />
          </Tooltip>
        </Col>
      </Row>
      <DictionaryModal openModal={isModalOpen} callback={closeModal} />
      <E_ListSimple
        params={_params}
        onItemSelected={onItemSelected}
        reloadList={doReload}
        onListReloaded={()=>setDoReload(false)}
        requestUrl={"api/words/searchBy"}
      />
    </div>
  );
};

const styles = {
  boxTitle: {
    fontSize: "13px",
    color: "#076af5",
    fontFamily: "Montserrat",
    paddingBottom: "10px",
  },
};

export default MyWordList;



