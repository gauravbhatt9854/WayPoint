import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { useAuth0 } from "@auth0/auth0-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { UserContext } from "../src/App";

const SERVER_URL = import.meta.env.VITE_SOCKET_SERVER;

const socket = io(SERVER_URL);

// Fix Leaflet's default icon paths
delete L.Icon.Default.prototype._getIconUrl;

const Globe = () => {
  const { user, isAuthenticated } = useAuth0();
  // const [clients, setClients] = useState([]);
  const { clients, setClients } = useContext(UserContext);

  const [userLocation, setUserLocation] = useState([23, 79]);

  // Custom icon for the logged-in user (uses the profile picture)
  const userIcon = new L.Icon({
    iconUrl: user?.picture || "fallback-image-url", // Fallback if no profile picture
    iconSize: [40, 40], // Customize the size as needed
    iconAnchor: [20, 40], // Adjust the anchor point (center of the icon)
    popupAnchor: [0, -40], // Position the popup correctly above the icon
  });

  // Default icon for other clients (uses profile URLs if available)
  const getClientIcon = (profileUrl) => {
    return new L.Icon({
      iconUrl: profileUrl || "fallback-image-url",
      iconSize: [40, 40], // Customize the size as needed
      iconAnchor: [20, 40], // Adjust the anchor point (center of the icon)
      popupAnchor: [0, -40], // Position the popup correctly above the icon
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (user) loc_share(); // Only call loc_share if the user object is loaded
    }, 5000);

    socket.on("allLocations", (data) => {
      console.log("Received all locations");
      setClients(data);
    });

    socket.on("new-user", (soc) => {
      console.log("New user joined with socket: ", soc);
    });

    return () => {
      clearInterval(interval);
      socket.off("allLocations");
      socket.off("new-user");
    };
  }, [user]); // Add `user` as a dependency to re-run the effect when it changes

  const loc_share = () => {
    if (navigator.geolocation && user) {
      // Ensure `user` is defined
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(latitude, " <<--->> ", longitude);
        socket.emit("loc-res", {
          l1: latitude,
          l2: longitude,
          username: user.name || "name not found",
          profileUrl: user.picture || "fallback-image-url", // Send the profile URL
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
    <div className="h-[95%] ">
      {isAuthenticated ? (
        <div className="w-screen h-[90%] border-blue-600 border-4 flex-col gap-1">
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
            {/* User's Marker */}
            <Marker position={userLocation} icon={userIcon}>
              <Popup>{user.name}</Popup>
            </Marker>

            {/* Markers for Other Clients */}
            {clients.map(({ id, l1, l2, username, profileUrl }) => (
              <Marker
                key={id}
                position={[l1, l2]}
                icon={getClientIcon(profileUrl)}
              >
                <Popup>{username} is here in the map</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      ) : (
        <div>Login first</div>
      )}
    </div>
  );
};

export default Globe;
