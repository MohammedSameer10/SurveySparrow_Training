import React, { useState } from 'react';
import axios from 'axios';
import { User, Lock } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';
import registerPageImage from '../../../assets/loginPageImage.avif';
import Loader from '../../../components/Login/Loader';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    setUsernameError('');
    setEmailError('');
    setPasswordError('');

    if (!username) {
      setUsernameError('Username is required');
      return;
    }
    if (!/^[A-Za-z][A-Za-z0-9_ ]*$/.test(username)) {
      setUsernameError('Username must start with a letter and contain only letters, numbers, spaces, or underscores');
  return;
}

    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format');
      return;
    }

    if (!password) {
      setPasswordError('Password is required');
      return;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8080/users/register', {
        username,
        email,
        password,
      });

      if (res.status === 201) {
        setShowLoader(true);
        setTimeout(() => {
          setShowLoader(false);
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Register failed:', error);
      setShowLoader(false);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 2000);
    }
  };

  return (
    <>
      {showError && (
        <div className="register-error-popup">
          Registration failed. Please try again.
        </div>
      )}
      {showLoader && <Loader />}
      {!showLoader && (
        <div className="RegisterFullPage">
          <div className="RegisterBody">
            <div className="RegisterLeft">
              <div className="RegisterContent">
                <h1>Register</h1>
                <p>Create your Sociogram account</p>

                <div className={`RegisterUserInp ${usernameError ? 'error-border' : ''}`}>
                  <span><User /></span>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setUsernameError('');
                    }}
                  />
                </div>
                {usernameError && <p className="error-text">{usernameError}</p>}

                <div className={`RegisterUserInp ${emailError ? 'error-border' : ''}`}>
                  <span><User /></span>
                  <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError('');
                    }}
                  />
                </div>
                {emailError && <p className="error-text">{emailError}</p>}

                <div className={`RegisterUserInp ${passwordError ? 'error-border' : ''}`}>
                  <span><Lock /></span>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError('');
                    }}
                  />
                </div>
                {passwordError && <p className="error-text">{passwordError}</p>}

                <button onClick={handleRegister}>Register</button>
              </div>
            </div>
            <div className="RegisterRight">
              <img src={registerPageImage} alt="register" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
