import { React, useContext, useState, useEffect } from 'react'
import Map from './Map'
import Chat from './Chat'
import { SocketContext } from "../providers/SocketProvider";
import { Contribute } from './Contibute'
import { MapProvider } from "../providers/MapProvider";
const Home = () => {

    const {
        clients,
        setClients,
        user,
        socket,
        isMap,
        isChat,
    } = useContext(SocketContext);
    const [showContribute, setShowContribute] = useState(false);

    useEffect(() => {
        if (!isMap && !isChat) {
            setShowContribute(true); // Show Contribute page if both are hidden
        } else {
            setShowContribute(false);// Hide Contribute page if any of them are visible
        }
    }, [isMap, isChat]);
    return (
        <div className="pl-2 md:pl-10 pt-5 lg:pt-0 h-[85%] lg:h-[85%] w-full flex flex-col lg:flex-row gap-5 justify-center lg:p-5 items-center overflow-hidden relative z-1">
            <Chat></Chat>
            <Map></Map>
            {showContribute && <Contribute />}
        </div>
    )
}

export default Home