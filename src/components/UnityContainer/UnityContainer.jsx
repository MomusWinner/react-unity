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


    function connect() {
        props.ws.onclose = (event) => {
            console.log("close ---------");
            sendMessage("ReactEventsHandler", "OnDisconnected");
        };
        props.ws.onopen = (event) => {
            console.log("open ----------")
            sendMessage("ReactEventsHandler", "OnConnected")
        };
        props.ws.onmessage = (event) => {
            console.log(event.data);
            sendMessage("ReactEventsHandler", "GetMessage", event.data);
        };
    }
    connect();


    const handleConnect = useCallback(()=>{
        if (props.ws.readyState === WebSocket.OPEN || props.ws.readyState === WebSocket.CONNECTING){
            return;
        }
        props.reconnect();
    });

    const handleClose = useCallback(()=>{
        props.ws.close();
    });

    const handleSendMessage = useCallback((json)=>{
        console.log(props.ws.readyState);
        props.ws.send(json);
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