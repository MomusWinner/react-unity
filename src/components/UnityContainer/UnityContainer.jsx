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
    
    const handleSendMesage = useCallback((json)=>{
       props.socket.send(json)
    });

    useEffect(() => {
        addEventListener("OnSendMessage", handleSendMesage);
        return () => {
            removeEventListener("OnSendMessage", handleSendMesage);
        };
    }, [addEventListener, removeEventListener, handleSendMesage]);

    props.socket.addEventListener("message", (event) => {
        console.log(event.data);
        sendMessage("ReactEventsHandler", "GetMessage", event.data);
    });

    return (<div>
        <Unity unityProvider={unityProvider} style={{width: "100vw", height: "100vh", overflow: "hidden", zIndex: 0}}/>
    </div>);
}