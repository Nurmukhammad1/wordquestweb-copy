import React from "react";
import { useState, useEffect } from "react";
import Modal from "antd/es/modal/Modal";
import { Space, Radio, Select, SelectProps } from "antd";
import ListInfinite from "./ListInfinite";
import Iterable from "../types/Iterable";
import axios from "axios";
import { iterableBuilder } from "../types/IterableClass";
import { useToken } from "../hooks/useToken";
import CONFIG from "../Config";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { useUser } from "../hooks/useUser";

interface Props {
  openModal: boolean;
  callback: any;
}

const levels = ["all", "a1", "a2", "b1", "b2", "c1", "c2"];

const fetchAndMap = (path: string, params: any, token: any): any => {
  return axios
    .get(CONFIG.BACK_SERVER_DOMAIN + path, {
      headers: { Authorization: token ? `${token}` : null },
      params: params,
    })
    .then((response) => {
      let mappedContent: Iterable[] = [];
      response.data.content.forEach((e: any) => {
        mappedContent.push(iterableBuilder(e.id, e.title, e.content, e.details));
      });
      response.data.content = mappedContent;
      return response.data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const DictionaryModal: React.FC<Props> = ({ openModal, callback }) => {
  const [langLevel, setLangLevel] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pressedOk, setPressedOk] = useState(false);
  const [pressedCancel, setPressedCancel] = useState(false);
  const [_token] = useToken();

  const [_size, setSize] = useState<SizeType>("middle");
  const [_options, setOptions] = useState<SelectProps["options"]>([]);
  const [_dict, setDict] = useState("");
  const user = useUser();

  useEffect(() => {
    fetchDictionary();
  }, []);

  useEffect(() => {
    setIsModalOpen(openModal);
  }, [openModal]);

  const fetchDataFunction = (page: number, langLevel: string) => {
    let params = {
      pageNo: page,
      pageSize: 10,
      sortBy: "word",
      direction: "asc",
      langLevel,
      dict: _dict,
    };
    return fetchAndMap("api/words/byDict", params, _token);
  };

  const fetchDictionary = function () {
    let path = `api/words/dicts`;
    return axios
      .get(CONFIG.BACK_SERVER_DOMAIN + path, {
        headers: { Authorization: _token ? `${_token}` : null },
      })
      .then((response) => {
        let options: SelectProps["options"] = [];
        response.data.forEach((e: any) => {
          {
            options.push({
              value: e.id,
              label: e.description,
            });
          }
        });
        setOptions(options);
      });
  };

  const handleOk = () => {
    setPressedOk(true);
    setPressedCancel(false);
  };

  const handleCancel = () => {
    setPressedOk(false);
    setPressedCancel(true);
    callback();
    setIsModalOpen(false);
  };

  const saveWords = (userId:number, selectedItems:Iterable[]) => {
    let path = `api/words?id=${user.userid}`;
    let data = selectedItems.map(e => e.getId());
    let config= {
      headers: { Authorization: _token ? `${_token}` : null },
    };

    axios
      .post(CONFIG.BACK_SERVER_DOMAIN + path, data, config)
      .then((response) => {
        
      })
      .catch((error) => {
        console.error("Error:", error);
      });

}

  const saveAndClose = (userId: number, items: Iterable[]) => {
    saveWords(userId, items);
    callback();
    setPressedOk(false);
    setPressedCancel(false);
    setIsModalOpen(false);
  };

  const handleChange = (value: string) => {
    setLangLevel(value);
  };

  const handleSelectChange = (value: string) => {
    setDict(value);
  };

  return (
    <Modal
      width={"300px"}
      style={{ top: "50%", transform: "translateY(-50%)" }}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      title="pick a word to learn"
    >
      <Space direction="vertical">
        <Space direction="vertical">
          <Select
            size={_size}
            placeholder="Choose a dictionary"
            onChange={handleSelectChange}
            style={{ width: 200 }}
            options={_options}
          />
          <Radio.Group
            size="small"
            value={langLevel}
            onChange={(e) => handleChange(e.target.value)}
          >
            {levels.map((level) => (
              <Radio.Button key={level} value={level}>
                {level.toUpperCase()}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Space>
        {_dict && (
          <ListInfinite
            fetchFunction={fetchDataFunction}
            aLangLevel={langLevel}
            pressedOk={pressedOk}
            pressedCancel={pressedCancel}
            save={saveAndClose}
          />
        )}
      </Space>
    </Modal>
  );
};

export default DictionaryModal;
