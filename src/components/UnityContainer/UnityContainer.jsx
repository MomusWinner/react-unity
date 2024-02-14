import React, {useCallback, useEffect} from "react";
import  {Unity,useUnityContext} from "react-unity-webgl";

export function UnityContainer(){
    const {unityProvider, sendMessage, addEventListener, removeEventListener, isLoaded} =
        useUnityContext({
            loaderUrl: "./build/unity.loader.js",
            dataUrl: "./build/unity.data",
            frameworkUrl: "./build/unity.framework.js",
            codeUrl: "./build/unity.wasm",
        });
    
    var ws = connect();

    function connect() {
        ws = new WebSocket('ws://195.161.69.62/Joystick');
        ws.addEventListener("close", (event) => {
            sendMessage("ReactEventsHandler", "OnDisconnected");
        });
        ws.addEventListener("open", (event) => {
            sendMessage("ReactEventsHandler", "OnConnected")
        });
        ws.addEventListener("message", (event) => {
            console.log(event.data);
            sendMessage("ReactEventsHandler", "GetMessage", event.data);
        });
        return ws
    }

    const handleSendMessage = useCallback((json)=>{
       ws.send(json)
    });

    const handleConnect = useCallback(()=>{
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING){
            return;
        }
        ws = connect()
    });

    const handleClose = useCallback(()=>{
        ws.close()
    });

    useEffect(() => {
        addEventListener("OnSendMessage", handleSendMessage);
        return () => {
            removeEventListener("OnSendMessage", handleSendMessage);
        };
    }, [addEventListener, removeEventListener, handleSendMessage]);

    useEffect(() => {
        addEventListener("OnConnect", handleConnect);
        return () => {
            removeEventListener("OnConnect", handleConnect);
        };
    }, [addEventListener, removeEventListener, handleConnect]);


    return (<div>
        <Unity unityProvider={unityProvider} style={{width: "100vw", height: "100vh", overflow: "hidden", zIndex: 0}}/>
    </div>);
}