import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToken } from "../../hooks/useToken";
import axios from "axios";
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
// import 'antd/dist/antd.css'; // Импортируем стили Ant Design

const LoginPage: React.FC = () => {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useToken();
  const navigate = useNavigate(); 

  const onLogInClicked = async () => {
    try {
      const response = await axios.post('http://localhost:8080/login', {}, {
        headers:  {
          "username": emailValue,
          "password": passwordValue,
        }
      });
      setToken(response.headers.getAuthorization());
      navigate("/");
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const onForgotPasswordClicked = () => {
    navigate("/forgot-password");
  };

  const onSignUpClicked = () => {
    navigate("/sign-up");
  };

  return (
    <div className='login'>
      <div className='login-container'>
        <h1 className='login-title'>Log In</h1>
        {errorMessage && <div>{errorMessage}</div>}
        <input
          value={emailValue}
          onChange={(e) => setEmailValue(e.target.value)}
          placeholder='Enter your login'
          className='emailInput'
        />
        <div className='passwordInputContainer'>
          <input
            value={passwordValue}
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => setPasswordValue(e.target.value)}
            placeholder='password'
            className='passwordInput'
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)} 
            className='showPasswordButton'
          >
            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </button>
        </div>
        <hr style={{ marginBottom: '20px' }} />
        <div className='authorizationButtons'>
          <button 
            disabled={!emailValue || !passwordValue} 
            onClick={onLogInClicked}
            className="loginButton"
          >
            Log In
          </button>
          <button 
            onClick={onForgotPasswordClicked}
            className="forgotPasswordButton"
          >
            Forgot password?
          </button>
          <button 
            onClick={onSignUpClicked}
            className="signUpButton"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
