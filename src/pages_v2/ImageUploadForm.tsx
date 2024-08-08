import axios from "axios";
import React, { useState } from "react";
import Config from "../Config";
import { useToken } from "../hooks/useToken";

interface ImageUploadFormProps {
  themeId: number;
  onImageUpload:(urlId:string)=>void;
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({ 
  themeId, 
  onImageUpload,
}) => {
  const [selectedImage, setSelectedImage] = useState<any>();
  const [preview, setPreview] = useState<any>();
  const [token] = useToken();
 

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (!selectedImage) {
      alert("Please select an image to upload");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", selectedImage);

    let path = `api/images/upload/${themeId}`;

    axios
      .post(Config.BACK_SERVER_DOMAIN + path, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token ? `${token}` : null,
        },
      })
      .then((response) => 
        onImageUpload(response.data)
    )
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div style={{marginTop:"20px"}}>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && (
          <div>
            <img
              src={preview}
              alt="Preview"
              style={{ width: "80px", height: "auto" }}
            />
          </div>
        )}
        <button type="submit">Upload Image</button>
      </form>
      <p style={{ fontFamily: "Merriweather", fontSize:"10px"}}></p>
    </div>
  );
};

export default ImageUploadForm;
