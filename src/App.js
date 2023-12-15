import './App.css';
import {UnityContainer} from "./components/UnityContainer/UnityContainer";

const socket = new WebSocket("ws://localhost:9000");

function App() {
  return (
    <div className="App">
      <UnityContainer socket={socket}/>
    </div>
  );
}

export default App;


        
// Connection opened
socket.addEventListener("open", (event) => {
  socket.send("Hello Server!");
});

// Listen for messages
socket.addEventListener("message", (event) => {
  console.log("Message from server ", event.data);
});