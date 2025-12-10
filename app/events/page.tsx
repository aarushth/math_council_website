"use client";
import { useEffect, useState } from "react";
import ActiveEventTable from "@/components/ActiveEventTable";
import RegistrationForm from "@/components/RegistrationForm";
import { useSession } from "next-auth/react";

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
}


export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const { data: session, status } = useSession();
  useEffect(() => {
      fetch("/api/event/active")
        .then((res) => res.json())
        .then((data) => {
          setEvents(data);
          setLoading(false);
        });
    }, []);

  if (!session || !session.user?.email) {
    return <p className="p-6 text-center">Please log in to see events.</p>;
  }

  const userId = session.user.id;
  
  

  if (loading) return <p>Loading...</p>;
  if (!events.length) return <p>No active events.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Events</h1>
      {events.map(event => (
        <div key={event.id}>
          <ActiveEventTable event={event} onRegisterClick={() => setOpenModal(true)}/> 
          <RegistrationForm event={event} open={openModal} setOpen={setOpenModal}/>
        </div>
      ))}
    </div>
  );
}
