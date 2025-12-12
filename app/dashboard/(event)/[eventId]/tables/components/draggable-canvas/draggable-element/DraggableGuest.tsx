import { useDraggable } from '@dnd-kit/core';
import React from 'react';

// Tipul de date pentru un invitat
interface GuestItem {
  id: string; // ID-ul invitatului
  name: string;
}

const DraggableGuest: React.FC<GuestItem> = ({ id, name }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    attributes: {
      role: 'button',
      roleDescription: 'draggable element',
      tabIndex: 0,
    },
    id: `guest-${id}`,
    data: {
      fromSideBar: true,
      type: 'guest',
      guestId: id,
      guestName: name,
    },
  });

  // Translate-ul trebuie aplicat DND-Kit. Lăsăm `position` implicit, nu `absolute`.
  const style = transform
    ? {
        zIndex: 9999, // Asigurăm că este deasupra celorlalte elemente
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-2 mb-1 bg-gray-100 rounded-md shadow-sm border border-gray-300 hover:bg-blue-100 cursor-grab text-sm flex items-center justify-between max-w-[200px] max-h-[40px] gap-2 overflow-hidden"
    >
      <span className="bg-[url(/character-avatar-icon.png)] rounded-full border border-gray-500 bg-cover bg-center shadow-lg w-6 h-6"></span>
      <span>{name}</span>
    </div>
  );
};

export default DraggableGuest;
