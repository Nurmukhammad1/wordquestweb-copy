import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import CardMarkDownBasic from "./CardMarkDownBasic";
import CardMarkDownLangLearn from "./CardMarkDownLangLearn";
import Iterable from "./types/Iterable";
import axios from "axios";
import Config from "../Config";
import { useToken } from "./hooks/useToken";

interface Props {
  goalType: string;
  goalId: number;
  step: Iterable;
  openModal: boolean;
  closeModalCallback: () => void;
}

const StepModal: React.FC<Props> = ({
  goalId,
  goalType,
  step,
  openModal,
  closeModalCallback,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_token] = useToken();
  useEffect(() => {
    setIsModalOpen(openModal);
  }, [openModal]);

  const handleOk = (item: Iterable) => {
    handleClose();
  };

  const handleClose = () => {
    setIsModalOpen(false);
    closeModalCallback();
  };

  const onSaveStep = (item: Iterable) => {
    let path = `api/steps/${goalId}`;
    axios.post(Config.BACK_SERVER_DOMAIN + path, item, {
      headers: {
        Authorization: _token ? `${_token}` : null,
      },
    });
  };

  return (
    <Modal
      width={"670px"}
      style={{ top: "50%", transform: "translateY(-50%)" }}
      open={isModalOpen}
      footer={null}
    >
      {(goalType === "" || goalType === "Markdown") && (
        <>
          <CardMarkDownBasic
            onEditing={() => console.log()}
            onSaveCard={(item: Iterable) => {
              handleOk(item);
              onSaveStep(item);
            }}
            onCloseCard={() => {
              handleClose();
            }}
            card={step}
            outerStyle={{
              marginLeft: "15px",
              height: 400,
              width: 580,
            }}
          />
        </>
      )}
      {goalType === "Learn Language" && (
        <>
          <CardMarkDownLangLearn
            themeId={goalId}
            onEditing={() => console.log()}
            onSaveCard={(item: Iterable) => {
              console.log();
            }}
            onCloseCard={() => {
              console.log();
            }}
            card={step}
            outerStyle={{
              marginLeft: "15px",
              height: 400,
              width: 580,
            }}
          />
        </>
      )}
    </Modal>
  );
};

export default StepModal;
