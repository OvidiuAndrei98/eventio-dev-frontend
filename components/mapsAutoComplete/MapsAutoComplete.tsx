import React, { useEffect, useState } from 'react';
import { Libraries, useJsApiLoader } from '@react-google-maps/api';
import { Input } from '../ui/input';

const libs = ['places', 'core', 'maps', 'marker'] as Libraries;

interface MapsAutoCompleteProps {
  onLocationSelect: (location: {
    formatted_address: string;
    name: string;
    location: { lat: string; long: string };
  }) => void;
}

const MapsAutoComplete = ({ onLocationSelect }: MapsAutoCompleteProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
    libraries: libs,
  });
  const [setMarker, setSetMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);

  const mapRef = React.useRef<HTMLDivElement>(null);
  const autocompleteRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      const newMap = new google.maps.Map(mapRef.current, {
        disableDefaultUI: true,
        center: { lat: 44.4268, lng: 26.1025 }, // Piata Unirii, Bucharest
        zoom: 15,
        mapId: 'planyvite-newEvent-map',
      });
      setMap(newMap);

      if (autocompleteRef.current) {
        const newAutocomplete = new google.maps.places.Autocomplete(
          autocompleteRef.current,
          {
            fields: ['formatted_address', 'name', 'geometry'],
            componentRestrictions: {
              country: ['ro'], // Restrict to Romania
            },
          }
        );
        setAutocomplete(newAutocomplete);
      }
    }
  }, [isLoaded]);

  useEffect(() => {
    if (autocomplete) {
      autocomplete.addListener('place_changed', () => {
        if (setMarker) {
          setMarker.map = null; // Remove previous marker
        }
        const place = autocomplete.getPlace();
        if (place && place.geometry) {
          onLocationSelect({
            formatted_address: place.formatted_address || '',
            name: place.name || '',
            location: {
              lat: place.geometry.location?.lat().toString() || '',
              long: place.geometry.location?.lng().toString() || '',
            },
          });
          if (map) {
            const position = place.geometry?.location;
            if (position) {
              map.setCenter(position);
              const marker = new google.maps.marker.AdvancedMarkerElement({
                position: position,
                map: map,
                title: place.name || '',
              });
              setSetMarker(marker);
            }
          }
        }
      });
    }
  }, [autocomplete, map]);

  return (
    <div>
      <Input
        ref={autocompleteRef}
        className="focus:outline-[#B46ACA] focus:border-[#B46ACA] hover:border-[#B46ACA] my-4 focus:outline-[#B46ACA]"
      />
      {isLoaded ? (
        <div className=" h-[400px]" ref={mapRef} />
      ) : (
        <span>loading</span>
      )}
    </div>
  );
};

export default MapsAutoComplete;
