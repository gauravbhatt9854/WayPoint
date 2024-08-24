import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useAuth0 } from "@auth0/auth0-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const SERVER_URL = import.meta.env.VITE_SOCKET_SERVER;

const socket = io(SERVER_URL);

// Fix Leaflet's default icon paths
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Globe = () => {
  const { user, isAuthenticated } = useAuth0();
  const [clients, setClients] = useState([]);
  const [userLocation, setUserLocation] = useState([23, 79]);

  useEffect(() => {
    const interval = setInterval(() => {
      loc_share();
    }, 5000);

    socket.on("allLocations", (data) => {
      setClients(data);
    });

    return () => clearInterval(interval);
  }, []);

  const loc_share = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        socket.emit("loc-res", {
          l1: latitude,
          l2: longitude,
          name: user.name,
        });
        setUserLocation([latitude, longitude]);
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <div className="h-screen w-screen border-blue-600 border-4 flex flex-col">
          <h1 className="text-center text-red-500 text-2xl pt-5 font-bold bg-blue-300">
            YOUR MAP IS HERE
          </h1>
          <MapContainer
            center={userLocation}
            zoom={6}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={userLocation}>
              <Popup>{user.name}</Popup>
            </Marker>

            {clients.map(({ id, l1, l2, name }) => (
              <Marker key={id} position={[l1, l2]}>
                <Popup>{name} is here in the map</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      ) : (
        <div>Login first</div>
      )}
    </>
  );
};

export default Globe;
