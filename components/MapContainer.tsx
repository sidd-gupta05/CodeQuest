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
  id: string | number;
  name: string;
  rating: number;
  isAvailable: boolean;
  latitude: number;
  longitude: number;
  image: string;
};

interface MapBoxProps {
  labs: Lab[];
}

const MapBox: React.FC<MapBoxProps> = ({ labs }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  console.log('Labs passed to MapBox:', labs[0]);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const userLoc: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setPosition(userLoc);
      });
    }
  }, []);

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow">
      {position && (
        <MapContainer
          center={position}
          zoom={14}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User location marker */}
          <Marker position={position} icon={userIcon}>
            <Popup>Your Location</Popup>
          </Marker>

          {/* Labs from API */}

          {labs.map(
            (lab) => 
              lab.latitude &&
              lab.longitude && (
                <Marker
                  key={lab.id}
                  position={[lab.latitude, lab.longitude]}
                  icon={labIcon}
                >
                  <Popup>
                    <div className="w-56">
                      <div className="flex items-center gap-2 mb-2">
                        <Image
                          src={lab.image || '/placeholder.png'}
                          alt={lab.name}
                          width={40}
                          height={40}
                          className="rounded-md"
                        />
                        <div>
                          <h3 className="font-semibold text-sm">{lab.name}</h3>
                          <div className="flex items-center gap-1 text-xs">
                            ⭐ {lab.rating}{' '}
                            <span
                              className={`ml-2 ${
                                lab.isAvailable
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {lab.isAvailable
                                ? 'Available ✔️'
                                : 'Not Available ❌'}
                            </span>
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
              )
          )}
        </MapContainer>
      )}
    </div>
  );
};

export default MapBox;
