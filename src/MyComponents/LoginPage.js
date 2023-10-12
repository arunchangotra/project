import React, { useState } from "react";
import { MayaLogo } from "crayon-ui-kit";

import "./LoginPage.css";

function Loginpage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

 
    if (!formData.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    }

    
    if (
      formData.password &&
      (formData.password.length < 5 || !/[A-Z]/.test(formData.password))
    ) {
      newErrors.password =
        "Password must be at least 5 characters and contain at least one uppercase letter.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
  
      setSuccessMessage("Login successful!");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };
  return (
    <div className="container1">
      <div className="left1">
        <img src="/loggin.png" alt="Image" class="image11" />
      </div>
      <div className="right1">
        <div className="mayalogo1">
          <MayaLogo />
          <p className="text3">
            "Ai Powered Personilazation Engine Dedicated <br />
            To Understande Human Taste
          </p>
          <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{ margin: '20px 45px' }}
                />
                {errors.email && (
                  <div className="error-message">{errors.email}</div>
                )}
              </div>
              <div>
                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{ margin: '0px 20px' }}
                />
                {errors.password && (
                  <div className="error-message">{errors.password}</div>
                )}
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    style={{ margin: '20px 5px'}}
                  />
                  Remember Me
                </label>
              </div>
              <div>
                <button type="submit">Login</button>
              </div>
            </form>
            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )}
            <div className="image4"><img src="formbottom.png" alt="image" class="image5"/></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loginpage;
