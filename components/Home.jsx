import React, { useContext } from 'react';
import { MapProvider } from '../providers/MapProvider';
import { ChatProvider } from '../providers/ChatProvider';
import { SocketProvider } from '../providers/SocketProvider';


// Lazy imports
const Map = React.lazy(() => import('./Map'));
const Chat = React.lazy(() => import('./Chat'));
const Contribute = React.lazy(() => import('./Contribute'));
const Header = React.lazy(() => import("../components/Header"));

const Home = () => {
  return (
    <>
      <SocketProvider>
        <ChatProvider>
          <MapProvider>
            {/* Full viewport container */}
            <div className="flex flex-col h-screen w-full  overflow-hidden relative z-1">

              <Header />

              <div className="flex flex-col lg:flex-row gap-5 flex-1 h-[80%] justify-center items-center p-5 overflow-auto">
                <Chat />
                <Map />
                <Contribute />
              </div>

            </div>
          </MapProvider>
        </ChatProvider>
      </SocketProvider>
    </>
  )
}

export default Home