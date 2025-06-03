import {
  ElementType,
  EventLocation,
  LocationsTemplateElement,
  TemplateElement,
} from '@/core/types';
import Image from 'next/image';
import React from 'react';
import { BREAKPOINTS, mergeResponsiveProperties } from '../constants';

const LocationsElement = ({
  id,
  position,
  style,
  name,
  disabled,
  responsive,
  activeBreakpoint,
  isSelected,
  selectedElementId,
  eventAditionalLocations,
  eventDate,
  eventLocation,
  borderStyles,
  onSelect,
  editMode,
}: LocationsTemplateElement & {
  activeBreakpoint: keyof typeof BREAKPOINTS | 'desktop';
  eventLocation: EventLocation;
  eventAditionalLocations: EventLocation[];
  eventDate: string;
  selectedElementId?: string;
  isSelected?: boolean;
  onSelect?: (element: TemplateElement) => void;
  editMode?: boolean;
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const finalElementProps = mergeResponsiveProperties<LocationsTemplateElement>(
    {
      id: id,
      type: ElementType.locationsElement,
      position: position,
      disabled: disabled,
      style: style,
      name: name,
      borderStyles: borderStyles,
    },
    responsive,
    activeBreakpoint
  ) as LocationsTemplateElement;

  const containerStyle: React.CSSProperties = {
    ...finalElementProps.style,
    width: `${finalElementProps.style?.width}%`,
    borderStyle: `${finalElementProps.borderStyles?.sides}`,
    borderWidth: `${finalElementProps.borderStyles?.size}px`,
    borderColor: `${finalElementProps.borderStyles?.color}`,
  };

  return (
    <div
      style={{ ...containerStyle }}
      className={`w-full flex flex-wrap items-center justify-center ${
        editMode && isSelected && selectedElementId === id
          ? 'ring-inset ring-2 ring-[#CB93D9]'
          : ''
      } 
    ${
      editMode && !isSelected && isHovered
        ? 'ring-inset ring-1 ring-[#CB93D9]'
        : ''
    } z-3 p-2 ${
        editMode
          ? disabled
            ? 'opacity-[0.5]'
            : 'opacity-[1]'
          : disabled
          ? 'hidden'
          : 'block'
      }`}
      id={id}
      onMouseEnter={editMode ? () => handleMouseEnter() : undefined}
      onMouseLeave={editMode ? () => handleMouseLeave() : undefined}
      onClick={
        editMode
          ? (e) => {
              if (id) {
                e.preventDefault();
                e.stopPropagation();
                onSelect && onSelect(finalElementProps);
              }
            }
          : undefined
      }
    >
      {editMode && (
        <>
          {isSelected && selectedElementId === id && (
            <div className="absolute top-[27px] left-[8px] bg-[#CB93D9] text-nowrap text-white p-[3px] rounded-[4px_4px_4px_0] z-10 text-xs">
              {name}
            </div>
          )}
          {!isSelected && isHovered && (
            <div className="absolute top-[-13px] left-[-2px] bg-[#CB93D9] text-nowrap text-white p-[3px] rounded-[4px_4px_4px_0] z-10 text-xs">
              {name}
            </div>
          )}
          {isHovered && (
            <div className="absolute top-0 left-0 bottom-0 right-0 !bg-purple-100/20 transition-colors duration-200"></div>
          )}
        </>
      )}

      {eventAditionalLocations.map((location, idx) => (
        <EventLocationCard
          key={idx}
          eventLocation={location}
          eventDate={eventDate}
        />
      ))}
      <EventLocationCard eventLocation={eventLocation} eventDate={eventDate} />
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
    <div className="rounded-lg p-8 text-center text-gray-800 sm:p-6 md:p-8 lg:p-10 max-w-[380px]">
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
          {new Date(eventDate)
            .toLocaleDateString('ro-RO', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
            .charAt(0)
            .toLocaleUpperCase() +
            new Date(eventDate)
              .toLocaleDateString('ro-RO', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
              .slice(1)}
        </strong>
        <br />
        Ora {eventLocation?.locationStartTime}
      </p>
      <p className="text-gray-600 mb-8 leading-relaxed text-base sm:text-sm md:min-h-[70px]">
        {eventLocation.name}
        <br />
        {eventLocation.formatted_address}
      </p>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          eventLocation.formatted_address || eventLocation.name || ''
        )}`}
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
