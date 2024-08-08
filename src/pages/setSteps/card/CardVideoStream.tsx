import React, { useState, useEffect } from 'react';
import { Button, Card, Input, Layout, message, Modal, Upload } from 'antd';
import { Content, Footer, Header as Header } from 'antd/es/layout/layout';
import TextArea from 'antd/es/input/TextArea';
import ReactMarkdown from 'react-markdown';
import { CloseCircleOutlined, UploadOutlined, CloseSquareOutlined  } from '@ant-design/icons';
import { iterableBuilder } from '../../../types/IterableClass';
import Iterable from '../../../types/Iterable';
import Draggable from 'react-draggable';

interface Props {
	card: Iterable | null;
	outerStyle: any;
	onCloseCard: () => void;
	onSaveCard: (cardToSave: Iterable) => void;
	onEditing: () => void;
	onDeleteCard: () => void;
}

const CardVideoStream: React.FC<Props> = ({
	card,
	outerStyle,
	onCloseCard,
	onSaveCard,
	onEditing,
	onDeleteCard, 
  
  
}) => {
	const [editableId, setEditableId] = useState(0);
	const [editableContent, setEditableContent] = useState('');
	const [editableTitle, setEditableTitle] = useState('');
	const [wipContent, setWipContent] = useState('');
	const [wipTitle, setWipTitle] = useState('');
	const [editMode, setEditMode] = useState(false);
	const [videoFile, setVideoFile] = useState<File | null>(null);

	useEffect(() => {
		if (card != null && wipContent === editableContent && wipTitle === editableTitle) {
			setEditableId(card.getId());
			setEditableContent(card.getContent());
			setEditableTitle(card.getTitle());
			setWipContent(card.getContent());
			setWipTitle(card.getTitle());
		} else {
			alert('Save and Close current step first');
		}
	}, [card]);

	useEffect(() => {
		if (wipContent !== editableContent || wipTitle !== editableTitle) {
			onEditing();
		}
	}, [wipContent, wipTitle]);

	const onContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setWipContent(e.target.value);
	};

	const onContentClick = () => {
		setEditMode(true);
	};

	const handleKeyDown = (event: any) => {
		if (event.key === 'Enter' && event.ctrlKey) {
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
		let cardTosave = iterableBuilder(editableId, wipTitle, wipContent, videoFile);
		onSaveCard(cardTosave);
		close();
	};

	const close = () => {
		onCloseCard();
		setEditableId(0);
		setEditableTitle('');
		setEditableContent('');
		setWipContent('');
		setWipTitle('');
		setVideoFile(null);
	};

	const beforeUpload = (file: File) => {
		const isVideo = file.type.startsWith('video/');
		if (!isVideo) {
			message.error('You can only upload video files!');
		} else {
			message.success('Video file selected successfully');
			setVideoFile(file);
			console.log('Selected video file:', file);
		}
		return false;
	};

	const deleteCard = () => {
		onDeleteCard();
	};

	const showDeleteConfirm = () => {
		Modal.confirm({
			title: 'Are you sure you want to delete this card?',
			content: 'This action cannot be undone.',
			okText: 'Yes',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				deleteCard();
			},
		});
	};

	const removeVideo = () => {
		setVideoFile(null);
	};

	const videoUrl = videoFile ? URL.createObjectURL(videoFile) : '';

	return (
    <Draggable>
    <Card
      bordered={false}
      style={{
        position: 'relative',
        marginLeft: outerStyle === undefined ? '0px' : outerStyle.marginLeft,
        width: outerStyle === undefined ? 750 : outerStyle.width,
        height: outerStyle === undefined ? 500 : outerStyle.height + 60,
        overflowY: 'hidden',
        boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
        zIndex: 1,
      }}>
        <CloseCircleOutlined
          onClick={showDeleteConfirm}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            fontSize: '20px',
            zIndex: 1,
            transition: 'background-color 0.3s, color 0.3s',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.backgroundColor = 'transparent';
            (e.target as HTMLElement).style.color = '#ff4d4f';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.backgroundColor = 'transparent';
            (e.target as HTMLElement).style.color = 'inherit';
          }}
          onMouseDown={(e) => {
            (e.target as HTMLElement).style.backgroundColor = 'inherit';
            (e.target as HTMLElement).style.color = 'black';
          }}
          onMouseUp={(e) => {
            (e.target as HTMLElement).style.backgroundColor = '#f5f5f5';
            (e.target as HTMLElement).style.color = '#ff4d4f';
          }}
        /> 
      <Layout 
        style={{
          height: outerStyle === undefined ? 500 : outerStyle.height,
        }}
      >
        <Header
          style={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            padding: '0',
            borderBottom: '1px solid #f0f0f0',
            backgroundColor: '#f0efed',
          }}>
          <h3 style={{ margin: '0', lineHeight: '32px' }}>Title</h3>
          <Input
            placeholder='add step title'
            value={wipTitle}
            onChange={onTitleChange}
            style={{ width: '100%' }}
          />
        </Header>
        <Content style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {/* Зона 3: Загружаемый контент */}
          <div style={{ marginBottom: '10px', position: 'relative' }}>
            <h3>Upload Video</h3>
            {videoFile && (
              <div style={{ marginTop: '10px',  }}>
                <video
                  id='video-file'
                  controls
                  src={videoUrl}
                  style={{
                    width: '100%',
                    borderRadius: '5px',
                  }}
                />
                <CloseSquareOutlined 
                  onClick={removeVideo}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    fontSize: '20px',
                    color: '#ff4d4f',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                  }}
                />
              </div>
            )}
          </div>
          {/* Зона 2: Текстовое поле */}
          <div style={{ marginBottom: videoFile ? '60px' : '10px' }}>
            <h3>Description</h3>
            <Content
              onClick={onContentClick}
              style={{
                marginTop: '10px',
              }}>
              {editMode ? (
                <TextArea
                  onKeyDown={handleKeyDown}
                  showCount
                  maxLength={1000}
                  onChange={onContentChange}
                  placeholder='add step description'
                  value={wipContent}
                  style={{
                    padding: '0px',
                    border: '1px solid #0096FF',
                    borderRadius: '5px',
                    height: outerStyle === undefined ? 400 : outerStyle.height - 220,
                    width: outerStyle === undefined ? 700 : outerStyle.width - 60,
                    resize: 'none',
                    fontFamily: 'Merriweather',
                    fontSize: '16px',
                  }}
                  
                />
              ) : (
                <div
                  style={{
                    height: outerStyle === undefined ? 200 : outerStyle.height - 320,
                    border: '1px solid #E5E4E2',
                    padding: '5px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    borderRadius: '5px',
                    fontFamily: 'Merriweather',
                    wordWrap: 'break-word',
                    overflow: 'auto',
                    
                  }}>
                  <ReactMarkdown>{wipContent}</ReactMarkdown>
                </div>
              )}
            </Content>
          </div>
        </Content>
        {/* Зона 4: Кнопки Footer */}
        <Footer style={{ height: '35px', padding: '0px', marginTop: '5px', display: 'flex', justifyContent: 'space-between',  }}>
          <div>
            <Button style={{ marginRight: '5px' }} onClick={() => setEditMode(false)}>
              View
            </Button>
            <Button style={{ marginRight: '5px' }} onClick={() => setEditMode(true)}>
              Edit
            </Button>
            <Button style={{ marginRight: '5px' }} onClick={onPressCancel}>
              Cancel
            </Button>
            <Button style={{ marginRight: '5px' }} onClick={onPressOk}>
              Ok
            </Button>
          </div>
          <Upload beforeUpload={beforeUpload} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Adding video</Button>
          </Upload>
        </Footer>
      </Layout>
    </Card>
  </Draggable>
  

	);
};

export default CardVideoStream;
