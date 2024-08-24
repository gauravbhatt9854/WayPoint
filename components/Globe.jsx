import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useAuth0 } from "@auth0/auth0-react";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const SERVER_URL = import.meta.env.VITE_SOCKET_SERVER;

const socket = io(SERVER_URL);

const Globe = () => {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } =
    useAuth0();
  const [clients, setClients] = useState([]);
  const [userLocation, setUserLocation] = useState([23, 79]);

  useEffect(() => {
    const interval = setInterval(() => {
      loc_share();
    }, 5000); // Update every 5 seconds

    socket.on("allLocations", (data) => {
      setClients(data);
      // Optionally, update the map with new locations
    });

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  const loc_share = () => {
    console.log("running every 5 seconds");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        socket.emit("loc-res", {
          l1: latitude,
          l2: longitude,
          name: user.name,
        });
        setUserLocation([latitude, longitude]); // Update user location state
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

            {clients.map(({ id, l1, l2, name }) => {
              return (
                <Marker key={id} position={[l1, l2]}>
                  <Popup>{name} is here in the map</Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      ) : (
        <div>Login first</div>
      )}
    </>
  );
};

export default Globe;
