import React, { useState } from "react";
import { MayaLogo } from "crayon-ui-kit";
import "./Second.css";

function Second(){



    console.log("Check");

    return(
    <div className=" container1"> 
       <div className="left1">
       <img src="/second.png" alt="Image" class="image1"/>
       

       </div>
      <div className="right1">
        
        <div className="mayalogo1"> <MayaLogo/>
        <p className="text3">
          "Ai Powered Personilazation Engine Dedicated <br />
           To Understande Human Taste
        </p></div>
       
        <div className="rigt1"><img src="/right.png" alt="Image" class="image2"/></div>
        <div className=" links1"> 
        <p><a href="/forgot-password">Lost Your Password?</a></p>
        <p> <a href="/signup"> Not a Member Yet? Sign Up</a></p>
        <div className="image4"><img src="/formbottom.png" alt="Image" class="image5"/></div>
        </div>
       </div>
    </div>
    
    );

}
export default Second;