import { EventLocation } from '@/core/types';
import Image from 'next/image';
import React from 'react';

interface LocationsElementProps {
  id: string;
  eventLocation: EventLocation;
  eventAditionalLocations: EventLocation[];
  eventDate: string;
}
//grid grid-cols-1 md:grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 justify-center

const LocationsElement = ({
  id,
  eventLocation,
  eventAditionalLocations,
  eventDate,
}: LocationsElementProps) => {
  return (
    <div
      id={`locations-element-${id}`}
      className="w-full flex flex-wrap items-center justify-center"
    >
      <EventLocationCard eventLocation={eventLocation} eventDate={eventDate} />
      {eventAditionalLocations.map((location, idx) => (
        <EventLocationCard
          key={idx}
          eventLocation={location}
          eventDate={eventDate}
        />
      ))}
    </div>
  );
};

export default LocationsElement;

function EventLocationCard({
  eventLocation,
  eventDate,
}: {
  eventLocation: EventLocation;
  eventDate: string;
}) {
  return (
    <div
      className="
     rounded-lg  p-8 text-center text-gray-800
      sm:p-6 md:p-8 lg:p-10
    "
    >
      {eventLocation.locationImage && (
        <div
          className="
        w-36 h-36 rounded-full overflow-hidden mx-auto mb-6 
        sm:w-32 sm:h-32 md:w-40 md:h-40
      "
        >
          <Image
            src={eventLocation.locationImage?.url}
            alt="Event"
            className="w-full h-full object-cover"
            width={160}
            height={160}
          />
        </div>
      )}

      <h2
        className="
        font-serif text-3xl font-normal text-gray-700 mb-6 leading-tight
        sm:text-2xl md:text-3xl lg:text-4xl
      "
      >
        {eventLocation?.title}
      </h2>
      <p className="text-gray-600 mb-5 leading-relaxed text-lg sm:text-base">
        <strong className="text-gray-800">
          {new Date(eventDate).toLocaleDateString('ro-RO')}
        </strong>
        <br />
        {eventLocation?.locationStartTime}
      </p>
      <p className="text-gray-600 mb-8 leading-relaxed text-base sm:text-sm">
        {eventLocation.name}
        <br />
        {eventLocation.formatted_address}
      </p>
      <a
        // href={mapLink}
        target="_blank"
        rel="noopener noreferrer"
        className="
          inline-block bg-gray-400 text-white py-3 px-7 rounded-full
          font-bold text-lg transition-colors duration-300 ease-in-out
          hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-75
          sm:py-2 sm:px-6 sm:text-base
        "
      >
        Vezi hartă
      </a>
    </div>
  );
}
