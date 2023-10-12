import React, { useState } from "react";
import { MayaLogo } from "crayon-ui-kit";
import "./ForgetPassword.css";
import { useNavigate } from 'react-router-dom';



function ForgetPasswor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
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

    
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (formData.email && !emailPattern.test(formData.email)) {
      newErrors.email = "Invalid email address.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleResetPassword = () => {
    if (validateForm()) {
      const { email } = formData;
      
      setSuccessMessage("Password reset link sent to your email.");
      navigate(`/forgot-password/${email}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container1">
      <div className="left1">
        <img src="/forgetpassword.png" alt="Image" class="image11" />
      </div>
      <div className="right1">
        <div className="mayalogo1">
          <MayaLogo />
          <p className="text3">
            "Ai Powered Personilazation Engine Dedicated <br />
            To Understande Human Taste
          </p>
          <div>
            <div className="logo123"> 
            <img src="/lock.png" alt="Logo" class="logo1234"/>   
            <h5  id ="AAA" style={{ marginaBottom: "500px" }}>Forgot Password</h5>
            </div>
            <form>
              <div>
                <label>Email :</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  style={{ display: "block", marginTop: "10px" }}
                  onChange={handleInputChange}
                />
                {errors.email && <span>{errors.email}</span>}
              </div>
              <div>
                <button className="button10" onClick={handleResetPassword}>
                  Reset Password
                </button>
              </div>
            </form>
            {successMessage && <p>{successMessage}</p>}
          </div>
          <div className="backtologin">
            <p>
              <a href="/login" className="custom-link">
                Back to Login
              </a>
            </p>
          </div>

          <div className="image12">
            <img src="/formbottom.png" alt="Image" class="image50" />
          </div>
        </div>
      </div>
    </div>
  );
}
export default ForgetPasswor;
