import { useEffect, useContext, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { SocketContext } from "../providers/SocketProvider";
import { MapContext } from "../providers/MapProvider";
import { topLayerContext } from "../providers/TopLayerProvider";

const Map = () => {
  const { clients, user, userLocation, isMap } = useContext(SocketContext);
  const { setMapCenter, mapCenter } = useContext(topLayerContext);
  const { list, currMap } = useContext(MapContext);

  const isUserInteracting = useRef(false);
  const hasInitialized = useRef(false); // ✅ Only set center once on first load

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
      if (!hasInitialized.current) {
        map.setView(location, map.getZoom());
        setMapCenter(location); // ✅ Set mapCenter state only once
        hasInitialized.current = true;
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
        }, 10000);
        setMapCenter([map.getCenter().lat, map.getCenter().lng]); // ✅ Update center on zoom
      },
      moveend: () => {
        setTimeout(() => {
          isUserInteracting.current = false;
        }, 10000);
        setMapCenter([map.getCenter().lat, map.getCenter().lng]); // ✅ Update center on move
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
        center={mapCenter || userLocation} // fallback to userLocation just in case
        zoom={4}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution={list[currMap].attribution}
          url={list[currMap].url}
        />

        <MapEventHandler />
        <RecenterMap location={userLocation} />

        {ClientMarkers}
      </MapContainer>
    </div>
  );
};

export default Map;