import { Event, formatEventDate } from "@/components/primitives"
import { FaCalendar, FaMapMarkerAlt } from "react-icons/fa";
interface Props {
  event: Event;
}

export default function InactiveEventTable({event}: Props) {
    return (<>
            <p className="block text-xl">{event.name}</p>
            <p className="block text-xs -my-2 text-body">{event.description}</p>
            
            <div className="flex flex-row gap-4 mt-1">
                <FaCalendar className="size-4"></FaCalendar>
                <p className="text-xs font-normal text-body text-center">{formatEventDate(event.date)}</p>
            </div>
            <div className="flex flex-row gap-4">
                <FaMapMarkerAlt className="size-3"></FaMapMarkerAlt>
                <p className="text-xs font-normal text-body">Location</p>
            </div>
        </>);
}