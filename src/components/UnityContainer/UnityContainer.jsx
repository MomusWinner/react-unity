import React, {useCallback, useEffect, useState} from "react";
import  {Unity,useUnityContext} from "react-unity-webgl";

export function UnityContainer(){
    const [ws, setWs] = useState();
    const {unityProvider, sendMessage, addEventListener, removeEventListener} =
        useUnityContext({
            loaderUrl: "./build/unity.loader.js",
            dataUrl: "./build/unity.data",
            frameworkUrl: "./build/unity.framework.js",
            codeUrl: "./build/unity.wasm",
        });
    
    useEffect(() => {
        if (ws === undefined) return;
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
        return () => {
            if (ws !== undefined)  ws.close();
        };
    }, [ws, sendMessage]);

    const handleConnect = useCallback(()=>{
        setWs(new WebSocket('wss://ocrv-game.ru/Joystick'));
    }, [setWs]);

    const handleClose = useCallback(()=>{
       ws.close();
    }, [ws]);

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