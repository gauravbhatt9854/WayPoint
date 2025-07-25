import React, { useContext, useEffect } from 'react';
import { SocketContext } from "../providers/SocketProvider";

// Lazy imports
const Map = React.lazy(() => import('./Map'));
const Chat = React.lazy(() => import('./Chat'));
const Contribute = React.lazy(() => import('./Contribute'));

const Home = () => {

    const context = useContext(SocketContext);
    if (!context) return null; // or show loading

    const {
        isMap,
    } = context;


    return (
        <div className="pl-2 md:pl-10 pt-5 lg:pt-0 h-[85%] lg:h-[85%] w-full flex flex-col lg:flex-row gap-5 justify-center lg:p-5 items-center overflow-hidden relative z-1">
            <Chat></Chat>
            {isMap && <Map></Map>}
            <Contribute></Contribute>
        </div>
    )
}

export default Home