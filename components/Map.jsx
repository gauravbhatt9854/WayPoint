import React, { useState, useEffect, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { SocketContext } from "../providers/SocketProvider";
import { MapContext } from "../providers/MapProvider";

const Map = () => {
  const {
    clients,
    user,
    socket,
  } = useContext(SocketContext);

  const { list, currMap } = useContext(MapContext);

  const [userLocation, setUserLocation] = useState([23, 79]);

  const userIcon = new L.Icon({
    iconUrl: user?.picture || import.meta.emv.VITE_SAMPLE_LOGO,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const getClientIcon = (profileUrl) => {
    return new L.Icon({
      iconUrl: profileUrl || import.meta.env.VITE_RANDOM_LOGO,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (user) loc_share();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const loc_share = () => {
    if (navigator.geolocation && user) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        socket.emit("loc-res", {
          l1: latitude,
          l2: longitude,
        });

        if (userLocation[0] !== latitude || userLocation[1] !== longitude) {
            setUserLocation((pre) => [latitude , longitude]);
        }
      });
    }
  };

  const RecenterMap = ({ location }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(location, map.getZoom());
    }, [location]);
    return null;
  };

  return (
    // <div className={`${isMap ? 'block' : 'hidden'} h-[50%] lg:h-[85%] w-[85%] lg:w-[50%]`}>
    <div className={`h-[50%] lg:h-[85%] w-[85%] lg:w-[50%]`}>
      <MapContainer
        center={userLocation}
        zoom={8}
        scrollWheelZoom={false}
        style={{
          height: window.innerWidth < 1024 ? '100%' : '100%',
          width: window.innerWidth < 1024 ? '100%' : '100%',
        }}
      >
        <TileLayer
          attribution={list[currMap].attribution}
          url={list[currMap].url}
        />
        <RecenterMap location={userLocation} />

        <Marker position={userLocation} icon={userIcon}>
          <Popup>{user.name}</Popup>
        </Marker>

        {clients.map(({ id, l1, l2, username, profileUrl }) => (

          <Marker key={id} position={[l1, l2]} icon={getClientIcon(profileUrl)}>
            <Popup>{username} is here on the map</Popup>
            {/* {console.log(profileUrl)} */}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
