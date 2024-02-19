import React, {useCallback, useEffect} from "react";
import  {Unity,useUnityContext} from "react-unity-webgl";

export function UnityContainer(props){
    const {unityProvider, sendMessage, addEventListener, removeEventListener, isLoaded} =
        useUnityContext({
            loaderUrl: "./build/unity.loader.js",
            dataUrl: "./build/unity.data",
            frameworkUrl: "./build/unity.framework.js",
            codeUrl: "./build/unity.wasm",
        });
    
    var ws = props.ws;

    function connect() {
        ws.onclose = (event) => {
            console.log("close ---------");
            sendMessage("ReactEventsHandler", "OnDisconnected");
        };
        ws.onopen = (event) => {
            console.log("open ----------")
            sendMessage("ReactEventsHandler", "OnConnected")
        };
        ws.onmessage = (event) => {
            console.log(event.data);
            sendMessage("ReactEventsHandler", "GetMessage", event.data);
        };
    }
    connect();


    const handleConnect = useCallback(()=>{
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING){
            return;
        }
        ws = props.reconnect();
        connect();
    });

    const handleClose = useCallback(()=>{
        ws.close();
    });

    const handleSendMessage = useCallback((json)=>{
        console.log(ws.readyState);
        ws.send(json);
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