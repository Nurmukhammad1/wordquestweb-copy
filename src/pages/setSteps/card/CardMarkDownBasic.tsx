import { Button, Card, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Content, Footer } from "antd/es/layout/layout";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { iterableBuilder } from "../../../types/IterableClass";
import Iterable from "../../../types/Iterable";

interface ModalProps {
  card: Iterable | null;
  outerStyle: any;
  onCloseCard: () => void;
  onSaveCard: (cardToSave: Iterable) => void;
  onEditing: () => void;
}

const CardMarkDownBasic: React.FC<ModalProps> = ({
  card,
  outerStyle,
  onCloseCard,
  onSaveCard,
  onEditing,
}) => {
  const [editableId, setEditableId] = useState(0);
  const [editableContent, setEditableContent] = useState("");
  const [editableTitle, setEditableTitle] = useState("");
  const [wipContent, setWipContent] = useState("");
  const [wipTitle, setWipTitle] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (
      card != null &&
      wipContent === editableContent &&
      wipTitle === editableTitle
    ) {
      setEditableId(card.getId());
      setEditableContent(card.getContent());
      setEditableTitle(card.getTitle());
      setWipContent(card.getContent());
      setWipTitle(card.getTitle());
    } else {
      alert("Save and Close current step first");
    }
  }, [card]);

  useEffect(() => {
    if (wipContent != editableContent || wipTitle != editableTitle) {
      onEditing();
    }
  }, [wipContent, wipTitle]);

  const onContentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let editedContent = e.target.value;
    setWipContent(editedContent);
  };

  const onContentClick = () => {
    setEditMode(true);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter" && event.ctrlKey) {
      setEditMode(false);
    }
  };

  const onTitleChange = (event: any) => {
    setWipTitle(event.target.value);
  };

  const onPressCancel = () => {
    close();
  };

  const onPressOk = () => {
    let cardTosave = iterableBuilder(editableId, wipTitle, wipContent, null);
    onSaveCard(cardTosave);
    close();
  };

  const close = () => {
    onCloseCard();
    setEditableId(0);
    setEditableTitle("");
    setEditableContent("");
    setWipContent("");
    setWipTitle("");
  };


  return (
    <Card
      bordered={false}
      style={{
        marginLeft: outerStyle === undefined ? "0px" : outerStyle.marginLeft,
        width: outerStyle === undefined ? 750 : outerStyle.width,
        height: outerStyle === undefined ? 500 : outerStyle.height + 60,
        boxShadow: "-0 0 8px rgba(0, 0, 0, 2)",
      }}
    >
      <Input
        placeholder={"add step title"}
        value={wipTitle}
        onChange={onTitleChange}
      />

      <Content
        onClick={onContentClick}
        style={{
          marginTop: "10px",
        }}
      >
        {editMode ? (
          <>
            <TextArea
              onKeyDown={handleKeyDown}
              showCount
              maxLength={1000}
              onChange={onContentChange}
              placeholder="add step description"
              value={wipContent}
              style={{
                padding: "0px",
                border: "1px solid #0096FF",
                borderRadius: "5px",
                height:
                  outerStyle === undefined ? 400 : outerStyle.height - 120,
                width: outerStyle === undefined ? 700 : outerStyle.width - 60,
                resize: "none",
                fontFamily: "Merriweather",
                overflow: "auto",
              }}
            />
          </>
        ) : (
          <div
            style={{
              height: outerStyle === undefined ? 400 : outerStyle.height - 120,
              border: "1px solid #E5E4E2",
              padding: "5px",
              paddingLeft: "10px",
              paddingRight: "10px",
              borderRadius: "5px",
              fontFamily: "Merriweather",
              wordWrap: "break-word",
              overflow: "auto",
              // whiteSpace: "pre-line",
            }}
          >
            <ReactMarkdown>{wipContent}</ReactMarkdown>
          </div>
        )}
      </Content>
      <Footer style={{ height: "35px", padding: "0px", marginTop: "5px" }}>
        <Button
          style={{ marginRight: "5px" }}
          onClick={() => setEditMode(false)}
        >
          View
        </Button>
        <Button
          style={{ marginRight: "5px" }}
          onClick={() => setEditMode(true)}
        >
          Edit
        </Button>
        <Button style={{ marginRight: "5px" }} onClick={onPressCancel}>
          Cancel
        </Button>
        <Button style={{ marginRight: "5px" }} onClick={onPressOk}>
          Ok
        </Button>
      </Footer>
    </Card>
  );
};
export default CardMarkDownBasic;



