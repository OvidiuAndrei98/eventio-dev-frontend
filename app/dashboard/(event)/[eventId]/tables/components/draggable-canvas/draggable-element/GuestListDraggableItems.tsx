import { Guest } from '@/core/types';
import DraggableGuest from './DraggableGuest';

const GuestListDraggableItems = ({
  unseatedGuests,
}: {
  unseatedGuests: Guest[];
}) => {
  return (
    <div className="flex flex-row gap-1 flex-wrap max-h-full overflow-y-auto p-2 border border-gray-300 rounded-md bg-white">
      {unseatedGuests.map((guest) => (
        <DraggableGuest
          key={guest.guestId}
          id={guest.guestId}
          name={guest.name}
        />
      ))}
      {unseatedGuests.length === 0 && (
        <p className="text-xs text-slate-500 italic">
          Toti invitatii sunt asezati.
        </p>
      )}
    </div>
  );
};

export default GuestListDraggableItems;
