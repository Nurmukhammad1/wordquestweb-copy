import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToken } from "../../hooks/useToken";
import axios from "axios";
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
// import 'antd/dist/antd.css'; // Импортируем стили Ant Design

const SignUpPage: React.FC = () => {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onSignUpClicked = async () => {
    try {
      const response = await axios.post('http://localhost:8080/sign-up', {
        "username": emailValue,
        "password": passwordValue
      });
      if (response.data === "OK") {
        // TODO: show successful user registration message and then propose to go to login page
      } else {
        // Propose to choose another username and propose otherwise
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const onLogInClicked = () => {
    navigate("/login");
  };

  return (
    <div className="signin">
      <div className="signin-container">
        <h1 className="login-title">Sign Up</h1>
        {errorMessage && <div>{errorMessage}</div>}
        <input
          value={emailValue}
          onChange={(e) => setEmailValue(e.target.value)}
          placeholder="Enter your login"
          className="emailInput"
        />
        <div className='passwordInputContainer'>
          <input
            value={passwordValue}
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => setPasswordValue(e.target.value)}
            placeholder="Enter a password"
            className="passwordInput"
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)} 
            className='showPasswordButton'
          >
            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </button>
        </div>
        <div className='passwordInputContainer'>
          <input
            value={confirmPasswordValue}
            type={showConfirmPassword ? 'text' : 'password'}
            onChange={(e) => setConfirmPasswordValue(e.target.value)}
            placeholder="Confirme password"
            className="passwordInput"
          />
          <button 
            type="button" 
            onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
            className='showPasswordButton'
          >
            {showConfirmPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </button>
        </div>
        <hr style={{ marginBottom: "20px" }}/>
        <div className='authorizationButtons'>
          <button
            disabled={
              !emailValue ||
              !passwordValue ||
              passwordValue !== confirmPasswordValue
            }
            onClick={onSignUpClicked}
            className="loginButton"
          >
            Sign Up
          </button>
          <button onClick={onLogInClicked} className="loginButton">Back to Log in</button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
