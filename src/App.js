import './App.css';
import {UnityContainer} from "./components/UnityContainer/UnityContainer";

//enter your server
const socket = new WebSocket("ws://localhost:9000");

function App() {
  return (
    <div className="App">
      <UnityContainer socket={socket}/>
    </div>
  );
}

export default App;