import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

import { Box, Paper, Typography } from "@mui/material";

interface InterviewLocation {
  id: string;
  latitude: number;
  longitude: number;
  completedAt?: string | null;
  startedAt?: string | null;
  interviewer?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

interface Props {
  locations: InterviewLocation[];
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

export default function InterviewLocationsMap({ locations }: Props) {
  if (locations.length === 0) {
    return (
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Ubicación de entrevistas
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Todavía no hay entrevistas con ubicación registrada.
        </Typography>
      </Paper>
    );
  }

  const center: [number, number] = [
    locations[0].latitude,
    locations[0].longitude,
  ];

  return (
    <Paper
      sx={{
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700}>
          Ubicación de entrevistas
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Ubicación registrada al iniciar cada entrevista.
        </Typography>
      </Box>

      <Box
        sx={{
          height: 450,
          width: "100%",
        }}
      >
        <MapContainer
          center={center}
          zoom={15}
          scrollWheelZoom
          style={{
            height: "100%",
            width: "100%",
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
                <Box sx={{ minWidth: 180 }}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    Entrevista
                  </Typography>

                  {location.interviewer && (
                    <Typography variant="body2">
                      <strong>Entrevistador:</strong>{" "}
                      {location.interviewer.firstName}{" "}
                      {location.interviewer.lastName}
                    </Typography>
                  )}

                  {location.completedAt && (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      <strong>Finalizada:</strong>{" "}
                      {new Date(location.completedAt).toLocaleString("es-AR")}
                    </Typography>
                  )}

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ mt: 1 }}
                  >
                    {location.latitude.toFixed(6)},{" "}
                    {location.longitude.toFixed(6)}
                  </Typography>
                </Box>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </Paper>
  );
}
