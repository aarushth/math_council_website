import { useState } from "react";
import { Registration, Event } from "./primitives";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { MdDelete, MdEdit } from "react-icons/md";

export default function RegistrationActionsCell({
  registration,
  event,
  deleteRegistration,
  editRegistration
}: {
  registration: Registration;
  event: Event;
  deleteRegistration: (id: number) => void;
  editRegistration: (registration : Registration) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex justify-center items-center gap-1">
      <Button variant="light" color="default" onPress={() => {editRegistration(registration)}}>
        <MdEdit size={15}/>
      </Button>

      <Popover
        color="default"
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <PopoverTrigger>
          <Button variant="light" color="danger">
            <MdDelete />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="flex flex-col gap-4 p-4">
          <p className="max-w-xs text-center">
            Are you sure you want to cancel {registration.studentName}'s
            registration for {event.name}?
          </p>

          <Button
            color="danger"
            variant="solid"
            onPress={() => {
              deleteRegistration(registration.id);
              setIsOpen(false);
            }}
          >
            Yes, Cancel
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
