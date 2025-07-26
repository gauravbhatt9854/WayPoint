import { useEffect, useContext, useMemo, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { SocketContext } from "../providers/SocketProvider";
import { MapContext } from "../providers/MapProvider";

const Map = () => {
  const { clients, user, userLocation, isMap } = useContext(SocketContext);
  const { list, currMap } = useContext(MapContext);

  const isUserInteracting = useRef(false); // ✅ useRef for consistent state

  const userIcon = useMemo(() => new L.Icon({
    iconUrl: user?.picture || import.meta.env.VITE_SAMPLE_LOGO,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  }), [user?.picture]);

  const getClientIcon = (profileUrl) => new L.Icon({
    iconUrl: profileUrl || import.meta.env.VITE_RANDOM_LOGO,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const RecenterMap = ({ location }) => {
    const map = useMap();

    useEffect(() => {
      if (!isUserInteracting.current) {
        map.setView(location, map.getZoom());
      }
    }, [location]);

    return null;
  };

  const MapEventHandler = () => {
    const map = useMapEvents({
      zoomstart: () => {
        isUserInteracting.current = true;
      },
      movestart: () => {
        isUserInteracting.current = true;
      },
      zoomend: () => {
        setTimeout(() => {
          isUserInteracting.current = false;
        }, 10000); // user inactive after 10s
      },
      moveend: () => {
        setTimeout(() => {
          isUserInteracting.current = false;
        }, 10000);
      },
    });

    return null;
  };

  const ClientMarkers = useMemo(() => (
    <>
      {clients.map(({ id, lat, lng, username, profileUrl }) => (
        <Marker key={id} position={[lat, lng]} icon={getClientIcon(profileUrl)}>
          <Popup>{username} is here on the map</Popup>
        </Marker>
      ))}
    </>
  ), [clients]);

  return (
    <div className={`${isMap ? 'block' : 'hidden'} h-[50%] lg:h-[85%] w-[85%] lg:w-[50%]`}>
      <MapContainer
        center={userLocation}
        zoom={8}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution={list[currMap].attribution}
          url={list[currMap].url}
        />

        <MapEventHandler />
        <RecenterMap location={userLocation} />

        <Marker position={userLocation} icon={userIcon}>
          <Popup>{user.name}</Popup>
        </Marker>

        {ClientMarkers}
      </MapContainer>
    </div>
  );
};

export default Map;