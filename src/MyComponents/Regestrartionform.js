// import React, { useState } from "react";
// import { MayaLogo } from "crayon-ui-kit";
 
// import App from "../App";


// function RegistrationForm() {
  

 
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     reason: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [successMessage, setSuccessMessage] = useState("");
//   const [sendCopy, setSendCopy] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
   
//     const validationErrors = {};

//     if (!formData.email) {
//       validationErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       validationErrors.email = "Invalid email format";
//     }

//     if (!formData.password) {
//       validationErrors.password = "Password is required";
//     } else if (!/^(?=.*[A-Z]).{5,}$/.test(formData.password)) {
//       validationErrors.password =
//         "Password should contain at least 5 characters and one uppercase letter";
//     }

//     if (Object.keys(validationErrors).length === 0) {
//       setSuccessMessage("Registration successful");
     
//     } else {
//       setErrors(validationErrors);
//       setSuccessMessage("");
//       window.location.href = '/second';
//     }
    
      
    
//   };

//   return (
//     <div className="container">
//       <div className="mayalogo">
//         <MayaLogo />
//         <p className="text1">
//           "Ai Powered Personilazation Engine Dedicated <br />
//           To Understande Human Taste
//         </p>
//       </div>

//       <h6 className="newuserlogo">
//         <img src="newuserlogo.png"></img>Request For Acess
//       </h6>

//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Email</label>
//           <input
//             type="email"
//             className={`form-control ${errors.email ? "is-invalid" : ""}`}
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//           />
//           {errors.email && (
//             <div className="invalid-feedback">{errors.email}</div>
//           )}
//         </div>
//         <div className="form-group">
//           <label>Name</label>
//           <input
//             type="name"
//             className={`form-control ${errors.name ? "is-invalid" : ""}`}
//             name="password"
//             value={formData.password}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div className="form-group">
//           <label>Reason For Acess</label>
//           <input
//             type="text"
//             className={`form-control ${errors.reason ? "is-invalid" : ""}`}
//             name="reason"
//             value={formData.reason}
//             onChange={handleInputChange}
//           />
//           {errors.reason && (
//             <div className="invalid-feedback">{errors.reason}</div>
//           )}
//         </div>
//         <div className="form-group">
//           <div className="form-check">
//             <input
//               type="checkbox"
//               className="form-check-input"
//               id="sendCopy"
//               name="sendCopy"
//               checked={sendCopy}
//               onChange={() => setSendCopy(!sendCopy)}
//             />
//             <label className="form-check-label" htmlFor="sendCopy">
//               Send me a copy of the email
//             </label>
//           </div>
//         </div>

//         <button type="submit" className="btn-primary" >
//           Submit
//         </button>
//       </form>

//       {successMessage && (
//         <div className="alert alert-success mt-3">{successMessage}</div>
//       )}
//     </div>
//   );
// }

// export default RegistrationForm;
import React, { useState } from "react";
import { MayaLogo } from "crayon-ui-kit";
import App from "../App";

function RegistrationForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    reason: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [sendCopy, setSendCopy] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    
    e.preventDefault();
    const validationErrors = {};
    

    if (!formData.email) {
      validationErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      validationErrors.password = "Password is required";
    } else if (!/^(?=.*[A-Z]).{5,}$/.test(formData.password)) {
      validationErrors.password =
        "Password should contain at least 5 characters and one uppercase letter";
    }

    if (Object.keys(validationErrors).length === 0) {
      setSuccessMessage("Registration successful");
      window.location.href = '/second';//////////////////////////////////////////////REDIRECT
    } else {
      setErrors(validationErrors);
      setSuccessMessage("");
    }
    
  };

  return (
    <div className="container">
      <div className="mayalogo">
        <MayaLogo />
        <p className="text1">
          "Ai Powered Personilazation Engine Dedicated <br />
          To Understand Human Taste
        </p>
      </div>

      <h6 className="newuserlogo">
        <img src="newuserlogo.png"></img>Request For Access
      </h6>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password}</div>
          )}
        </div>
        <div className="form-group">
          <label>Reason For Access</label>
          <input
            type="text"
            className={`form-control ${errors.reason ? "is-invalid" : ""}`}
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
          />
          {errors.reason && (
            <div className="invalid-feedback">{errors.reason}</div>
          )}
        </div>
        <div className="form-group">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="sendCopy"
              name="sendCopy"
              checked={sendCopy}
              onChange={() => setSendCopy(!sendCopy)}
            />
            <label className="form-check-label" htmlFor="sendCopy">
              Send me a copy of the email
            </label>
          </div>
        </div>

        <button type="submit" className="btn-primary">
          Submit
        </button>
      </form>

      {successMessage && (
        <div className="alert alert-success mt-3">{successMessage}</div>
      )}
    </div>
  );
}

export default RegistrationForm;

