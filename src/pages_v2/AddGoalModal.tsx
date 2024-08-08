import { Input, Modal, Select, SelectProps } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import { useToken } from "../hooks/useToken";
import { SizeType } from "antd/es/config-provider/SizeContext";
import CONFIG from "../Config";


interface AddThemeModelProps {
  openModal: boolean;
  closeModalCallback: () => void;
}

const AddGoalModal: React.FC<AddThemeModelProps> = ({
  openModal,
  closeModalCallback,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const user = useUser();
  const [token] = useToken();
  const [_themeType, setThemeType]= useState("");
  const [_token] = useToken();
  const [_options, setOptions] = useState<SelectProps['options']>([]);
  const [size, setSize] = useState<SizeType>('middle');


  useEffect(() => {
    fetchThemeTypes();
  }, []);

  useEffect(() => {
    setIsModalOpen(openModal);
  }, [openModal]);

  const fetchThemeTypes = function () {
    let path = `api/cards/themeTypes`;
    return axios
      .get(CONFIG.BACK_SERVER_DOMAIN + path, {
        headers: { Authorization: _token ? `${_token}` : null },
      })
      .then((response) => {
        let options: SelectProps['options'] = [];
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

  const saveTheme = (str: string) => {
    let path = `api/cards/theme/${user.userid}`;
    const body = {
      title: inputValue,
      themeTypeId: _themeType,
      description: "",
    };

    axios.post(CONFIG.BACK_SERVER_DOMAIN + path, body, {
      headers: {
        Authorization: token ? `${token}` : null,
      },
    }
  );
  };

  const handleOk = () => {
    if (inputValue.trim().length > 0) {
      saveTheme(inputValue);
    }
    handleClose();
  };

  const handleClose = () => {
    setInputValue("");
    setIsModalOpen(false);
    closeModalCallback();
  };

  const onEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent new line
      saveTheme(inputValue);
      setInputValue("");
      handleClose();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const handleAThemeTypeChange = (value: string) => {
    setThemeType(value);
  };

  return (
    <Modal
      width={"600px"}
      style={{ top: "50%", transform: "translateY(-50%)" }}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleClose}
    >
      <Input.TextArea
        showCount
        maxLength={150}
        autoSize={{ minRows: 1, maxRows: 6 }}
        placeholder="Add a goal"
        value={inputValue}
        onChange={handleChange}
        style={{ marginBottom: "20px", marginTop: "30px" }}
        onKeyDown={onEnter}
      />
      <Select
          size={size}
          placeholder="Type"
          onChange={handleAThemeTypeChange}
          style={{ width: 200 }}
          options={_options}
        />
    </Modal>
  );
};

export default AddGoalModal;
