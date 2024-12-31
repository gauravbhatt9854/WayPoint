import React, { useState, useEffect, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { SocketContext } from "../providers/SocketProvider";
import { MapContext, MapProvider } from "../providers/MapProvider";


const Map = () => {
  const {
    clients,
    setClients,
    user,
    socket,
    isMap,
    isChat,
  } = useContext(SocketContext);

  const { list, currMap, setCurrMap } = useContext(MapContext);

  const [userLocation, setUserLocation] = useState([23, 79]);

  const userIcon = new L.Icon({
    iconUrl: user?.picture || "fallback-image-url",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const getClientIcon = (profileUrl) => {
    return new L.Icon({
      iconUrl: profileUrl || "fallback-image-url",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (user) loc_share();
    }, 5000);

    socket.on("allLocations", (data) => {
      setClients(data);
    });

    socket.on("new-user", (soc) => { });

    return () => {
      clearInterval(interval);
      socket.off("allLocations");
      socket.off("new-user");
    };
  }, [user]);

  const loc_share = () => {
    if (navigator.geolocation && user) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        socket.emit("loc-res", {
          l1: latitude,
          l2: longitude,
          username: user.name || "name not found",
          profileUrl: user.picture || "fallback-image-url",
        });

        setUserLocation([latitude, longitude]);
      });
    } else {
      console.error(
        "Geolocation is not supported by this browser or user data is not ready."
      );
    }
  };

  return (
      <div className={`${isMap ? 'block' : 'hidden'} h-[50%] lg:h-[85%] w-[85%] lg:w-[50%]`}>
        
        <MapContainer
          center={userLocation}
          zoom={15}
          scrollWheelZoom={false}
          style={{
            height: window.innerWidth < 1024 ? '100%' : '100%',
            width: window.innerWidth < 1024 ? '100%' : '100%',
          }}
        >
          <TileLayer
            // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

            attribution={list[currMap].attribution}

            url={list[currMap].url}
          />

          <Marker position={userLocation} icon={userIcon}>
            <Popup>{user.name}</Popup>
          </Marker>

          {clients.map(({ id, l1, l2, username, profileUrl }) => (
            <Marker key={id} position={[l1, l2]} icon={getClientIcon(profileUrl)}>
              <Popup>{username} is here on the map</Popup>
            </Marker>
          ))}
        </MapContainer>

      </div>
  );
};

export default Map;
