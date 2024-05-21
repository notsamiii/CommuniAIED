import "./App.css";
import Camera from './components/Camera';
import SpeechToText from "./components/speechtotext";

const App = () => {
    return (
        <div className="container">
            <h2>CommunicAI-ed</h2>
            <div className="flex-container">
                <div className="flex-item">
                    <h3>Camera Access Canvas</h3>
                    <Camera/>
                </div>
                <div className="flex-item">
                    <SpeechToText />
                </div>
            </div>
        </div>
    );
};

export default App;