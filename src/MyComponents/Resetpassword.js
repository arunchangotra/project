import React from "react";
import { MayaLogo } from "crayon-ui-kit";
import { useParams } from 'react-router-dom';

import "./Resetpassword.css";

function Resetpassword() {
    const { email } = useParams();
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
          <img src="/lock.png" alt="Logo" class="logo10001"/>
          <h6 id="myheadding999">Forget Password </h6>
          </div>
          <h10 id="sub">Email has send to  your Inbox ({email}) with magic link to reset you credintials </h10>
          <h6 id="sub1">Reset magic link is valid for 30 minutes only </h6>
          <h6><a href="/login" className="custom-link">
                Back to Login
              </a></h6>
              <h6><a href="/resetcredintial" className="custom-link">
                Reset your credintials
              </a></h6>
          <div className="image567"><img src="/formbottom.png" alt="Image" class="image5"/></div>
        </div>
      </div>
    </div>
  );
}

export default Resetpassword;
