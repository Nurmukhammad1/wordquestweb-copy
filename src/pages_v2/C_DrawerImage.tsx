import React, { useEffect, useState } from "react";
import { Drawer, Space, Button, DrawerProps } from "antd";
import ImageUploadForm from "./ImageUploadForm";

interface Props {
  themeId:number;
  openDrawer: boolean;
  onSaveDrawer: (urlId:String) => void;
  onCloseDrawer: () => void;
}

const C_DrawerImage: React.FC<Props> = ({
  themeId,
  openDrawer,
  onSaveDrawer,
  onCloseDrawer,
}) => {
  const [_drawerOpen, setDrawerOpen] = useState(false);
  const [_placement, setPlacement] = useState<DrawerProps["placement"]>("right");
  const [imgId, setImgId] = useState("");

  useEffect(() => {
    if (openDrawer) {
      setDrawerOpen(true);
    }
  }, [openDrawer]);

  const onClose = () => {
    setDrawerOpen(false);
    onCloseDrawer();
  };

  const onSave = () => {
    onSaveDrawer(imgId);
    onClose();
  };


  return (
    <Drawer
      title="Images"
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
      <ImageUploadForm themeId={themeId} onImageUpload={setImgId}/>
    </Drawer>
  );
};

export default C_DrawerImage;
