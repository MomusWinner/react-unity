import './App.css';
import {UnityContainer} from "./components/UnityContainer/UnityContainer";


var host = "wss://ocrv-game.ru/Joystick";
var ws = new WebSocket(host);

function reconnect()
{
  console.log("reconnect -------")
  ws = new WebSocket(host);
  return ws;
}

function App() {
  return (
    <div className="App">
      <UnityContainer ws={ws} reconnect={reconnect}/>
    </div>
  );
}

export default App;