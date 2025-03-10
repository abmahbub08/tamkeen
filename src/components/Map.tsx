import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

// Define the props interface
interface Props {
  position: {
    lat: number;
    lng: number;
  };
}

const MapComponent = ({ position }: Props) => {
  // Load the Google Maps script
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Replace with your actual API key
  });

  // Center the map on the given position
  const mapCenter = {
    lat: position.lat,
    lng: position.lng,
  };

  if (!isLoaded) {
    return <div>Loading Map...</div>;
  }

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden bg-gray-100">
      <GoogleMap
        center={mapCenter}
        zoom={14} // Adjust zoom level as necessary
        mapContainerStyle={{ width: "100%", height: "100%" }}
      >
        {/* Marker at the provided position */}
        <Marker position={mapCenter} />
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
