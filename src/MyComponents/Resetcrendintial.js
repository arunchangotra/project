
// import React from "react";
// import { MayaLogo } from "crayon-ui-kit";
// import { useParams } from "react-router-dom";


// import "./Resetcrendintial.css";

// function Resetcrendintial() {
//   const { email } = useParams();

//   return (
//     <div className="container1">
//       <div className="left1">
//         <img src="/123.png" alt="Image" className="image11" />
//       </div>
//       <div className="right1">
//         <div className="mayalogo1">
//           <MayaLogo />
//           <p className="text3">
//             "Ai Powered Personalization Engine Dedicated <br />
//             To Understand Human Taste"
//           </p>

//           <div className="logo1000">
//             <img src="/clap.png" alt="Logo" className="logo1000123" />
//             <div className=" welcome">
//             <h6 id="myheadding20001">Welcome ({email})    <h8 id="credi">Reset your credentials</h8></h6>
            
//             </div>
//           </div>

//           <form>
//             <label htmlFor="password">Password:</label>
//             <input type="password" id="password123" name="password" required />

//             <label htmlFor="confirmPassword">Confirm Password:</label>
//             <input type="password" id="confirmPassword123" name="confirmPassword" required  />
//             <div className="clickbutton">    
//             <button type="submit">Submit </button>
//             </div>
//           </form>
//           <h6><a href="/login" className="custom-link123">
//                 Back to Login
//               </a></h6>

//           <div className="image5678">
//             <img src="/formbottom.png" alt="Image" className="image5" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Resetcrendintial;
import React, { useState } from "react";
import { MayaLogo } from "crayon-ui-kit";
import { useParams } from "react-router-dom";
import "./Resetcrendintial.css";

function Resetcrendintial() {
  const { email } = useParams();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here, e.g., making an API request
    // You can set 'submitted' to true upon successful submission
    // For this example, we'll just set it to true immediately
    setSubmitted(true);
  };

  return (
    <div className="container1">
      <div className="left1">
        <img src="/123.png" alt="Image" className="image11" />
      </div>
      <div className="right1">
        <div className="mayalogo1">
          <MayaLogo />
          <p className="text3">
            "Ai Powered Personalization Engine Dedicated <br />
            To Understand Human Taste"
          </p>

          <div className="logo1000">
            <img src="/clap.png" alt="Logo" className="logo1000123" />
            <div className="welcome">
              <h6 id="myheadding20001">Welcome</h6>
              <h7 id="credi">Reset credentials</h7>
            </div>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <label htmlFor="password">Password:</label>
              <input type="password" id="password123" name="password" required />

              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword123"
                name="confirmPassword"
                required
              />
              <div className="clickbutton">
                <button type="submit">Submit</button>
              </div>
            </form>
          ) : (
            <div className="success-message">
              <p>Reset password successful  {email}.</p>
            </div>
          )}

          <h6>
            <a href="/login" className="custom-link123">
              Back to Login
            </a>
          </h6>

          <div className="image5678">
            <img src="/formbottom.png" alt="Image" className="image5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resetcrendintial;

