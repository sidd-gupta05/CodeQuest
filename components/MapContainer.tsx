'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import Image from 'next/image';

const userIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const labIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
  iconSize: [25, 25],
  iconAnchor: [12, 25],
});

type Lab = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  display_name: string;
};

const MapBox = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [labs, setLabs] = useState<Lab[]>([]);

const fetchNearbyLabs = async (lat: number, lon: number) => {
  const radius = 2000; // in meters
  const query = `
    [out:json];
    (
      node["healthcare"="laboratory"](around:${radius},${lat},${lon});
      node["amenity"="hospital"](around:${radius},${lat},${lon});
    );
    out body;
  `;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query,
  });

  const result = await response.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedLabs = result.elements.map((lab: any, idx: number) => ({
    id: lab.id,
    name: lab.tags?.name || 'Unnamed Lab',
    lat: lab.lat,
    lng: lab.lon,
    display_name: lab.tags?.name || `Lab ${idx + 1}`,
  }));

  setLabs(formattedLabs);
};


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const userLoc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setPosition(userLoc);
        fetchNearbyLabs(userLoc[0], userLoc[1]);
        console.log(userLoc[0], userLoc[1]);
      });
    }
  }, []);

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow">
      {position && (
        <MapContainer center={position} zoom={14} scrollWheelZoom={true} className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={position} icon={userIcon}>
            <Popup>Your Location</Popup>
          </Marker>

          {labs.map((lab) => (
            console.log(lab),
            <Marker key={lab.id} position={[lab.lat, lab.lng]} icon={labIcon}>
              <Popup>
                <div className="w-56">
                  <div className="flex items-center gap-2 mb-2">
                    <Image src="/lab1.png" alt='Not available' width={40} height={40} className="rounded-md" />
                    <div>
                      <h3 className="font-semibold text-sm">{lab.name}</h3>
                      <div className="flex items-center gap-1 text-xs">
                        ⭐ 4.2 <span className="ml-2 text-green-600">Available</span>
                        <span className="ml-1 text-green-600">✔️</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">
                    <p>📞 0800-123-456</p>
                    <p>🕒 Report by: 24 hrs</p>
                  </div>
                  <button className="mt-2 w-full bg-[#2B7C7E] text-white py-1.5 rounded-full text-sm font-semibold hover:bg-[#236667]">
                    Book Appointment
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default MapBox;
