import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import L from "leaflet";

import type { ReportLocation } from "../../types/report";

import "leaflet/dist/leaflet.css";

interface LocationMapProps {
  locations: ReportLocation[];
}

const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function LocationMap({ locations }: LocationMapProps) {
  if (!locations.length) {
    return null;
  }

  const firstLocation = locations[0];

  return (
    <MapContainer
      center={[firstLocation.latitude, firstLocation.longitude]}
      zoom={14}
      scrollWheelZoom
      style={{
        height: "450px",
        width: "100%",
        borderRadius: "16px",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
          icon={markerIcon}
        >
          <Popup>
            <strong>Entrevista N.º {location.formNumber}</strong>

            <br />

            {location.interviewer ? (
              <>
                Entrevistador: {location.interviewer.firstName}{" "}
                {location.interviewer.lastName}
              </>
            ) : (
              "Entrevistador no identificado"
            )}

            <br />

            {location.completedAt
              ? `Finalizada: ${new Date(location.completedAt).toLocaleString(
                  "es-AR",
                )}`
              : "En progreso"}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
