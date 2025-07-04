"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { GeoPoint } from "firebase/firestore";
import { Icon } from "leaflet";

// Leaflet's default icons can be broken in React, so we create a custom one.
const customIcon = new Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

type MapViewProps = {
  geo: GeoPoint;
  title: string;
};

export default function MapView({ geo, title }: MapViewProps) {
  const position: [number, number] = [geo.latitude, geo.longitude];

  // A simple check for a valid (non-placeholder) GeoPoint
  if (geo.latitude === 0 && geo.longitude === 0) {
    return (
        <div className="bg-slate-200 h-96 rounded-lg flex items-center justify-center">
            <p>Map location not available for this listing.</p>
        </div>
    )
  }

  return (
    <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: '400px', width: '100%', borderRadius: '8px' }}>
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={customIcon}>
        <Popup>{title}</Popup>
      </Marker>
    </MapContainer>
  );
}
