import "./App.css";
import RegistrationForm from "./MyComponents/Regestrartionform";
import "bootstrap/dist/css/bootstrap.min.css";
import ImageProjection from "./MyComponents/Imageproject";

function App() {
  return (
    <div className="Background">
      <div className="col-8">
        <ImageProjection />
        <div className="text"><h9>"Ai powered personalization engine dedicated<p>to understand human taste"</p></h9></div>
      </div>
      <div className="col-4">
        <RegistrationForm />
        <div className="bottom">
          
          <img src="formbottom.png" alt="Image at the bottom" className="im"/>
        </div>
        
      </div>
    </div>
  );
}

export default App;
