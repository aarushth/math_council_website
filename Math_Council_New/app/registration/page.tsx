"use client";
import { useEffect, useState } from "react";
import ActiveEventTable from "@/components/ActiveEventTable";
import RegistrationForm from "@/components/RegistrationForm";
import { useSession } from "next-auth/react";
import { useDisclosure } from '@heroui/react'
import type { Event, Registration } from '@/components/primitives'

export default function RegistrationPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  // const [openModal, setOpenModal] = useState(false);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const { data: session, status } = useSession();
  function addRegistrationToEvent(eventId: number, registration: Registration) {
    setEvents(prevEvents =>
      prevEvents.map(ev =>
        ev.id === eventId
          ? { ...ev, registrations: [...ev.registrations, registration] }
          : ev
      )
    );
  }

  useEffect(() => {
      fetch("/api/event/active")
        .then((res) => res.json())
        .then((data) => {
          setEvents(data);
          setLoading(false);
          console.log(data);
        });
    }, []);

  if (!session || !session.user?.email) {
    return <p className="p-6 text-center">Please log in to see events.</p>;
  }
  if (loading) return <p>Loading...</p>;
  if (!events.length) return <p>No active events.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Events</h1>
      {events.map(event => (
        <div key={event.id}>
          <ActiveEventTable event={event} onRegisterClick={onOpen}/> 
          <RegistrationForm event={event} addRegistration={addRegistrationToEvent} isOpen={isOpen} onOpenChange={onOpenChange}/>
        </div>
      ))}
    </div>
  );
}
