"use client";

import { useState } from "react";
import RegistrationForm from "@/components/RegistrationForm";

interface Props {
  eventId: number;
  userId: number;
}

export default function RegistrationFormWrapper({ eventId, userId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {open ? "Close" : "Register"}
      </button>
      {open && <div className="mt-4"><RegistrationForm eventId={eventId} userId={userId} /></div>}
    </div>
  );
}
