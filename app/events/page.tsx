import { prisma } from "@/lib/prisma";
import RegistrationFormWrapper from "@/components/RegistrationFormWrapper";
import { getServerSession } from "next-auth/next";



export default async function EventsPage() {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return <p className="p-6 text-center">Please log in to see events.</p>;
  }

  const events = await prisma.event.findMany({
    orderBy: { id: "asc" },
  });
  const userId = session.user.id;
  const activeEvents = events.filter(e => e.active);
  const inactiveEvents = events.filter(e => !e.active);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Events</h1>

      {/* ACTIVE EVENTS */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Active Events</h2>
        <div className="space-y-3">
          {activeEvents.map(event => (
            <div
              key={event.id}
              className="border p-4 rounded-lg shadow-sm flex justify-between items-center"
            >
              <span className="font-medium">{event.name}</span>
              <RegistrationFormWrapper eventId={event.id} userId={userId} />
            </div>
          ))}
        </div>
      </section>

      <hr className="my-10" />

      {/* INACTIVE EVENTS */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Inactive Events</h2>
        <div className="space-y-3">
          {inactiveEvents.map(event => (
            <div
              key={event.id}
              className="border p-4 rounded-lg shadow-sm bg-gray-100"
            >
              <span className="font-medium">{event.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
