"use client";
import { Table, TableRow, TableCell, TableBody } from "flowbite-react";
import { CalendarIcon, MapPinIcon, PlusIcon } from "@heroicons/react/24/solid";

export function formatEventDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
}

interface Props {
  event: Event;
  onRegisterClick?: (event: Event) => void;
}


export default function ActiveEventTable({ event, onRegisterClick }: Props) {
  return (
<Table className="overflow-hidden">
    <caption className="px-5 font-medium flex flex-col justify-between text-heading bg-cyan-800 rounded-t-lg">
        <div className="flex flex-row gap-4 my-2">
            <p className="text-xl text-white">{event.name}</p>
            <p className="mt-1.5 text-sm text-white/60 font-normal text-body">{event.description}</p>
        </div>
        <div className="flex flex-row gap-4">
            <CalendarIcon className="size-5 text-white/80"></CalendarIcon>
            <p className="text-sm text-white/80 font-normal text-body text-center">{formatEventDate(event.date)}</p>
        </div>
        <div className="flex flex-row gap-4 my-3">
            <MapPinIcon className="size-5 text-white/80"></MapPinIcon>
            <p className="text-sm text-white/80 font-normal text-body">Location</p>
        </div>
        
    </caption>
    <TableBody className="bg-cyan-50 rounded-b-xl">
        <TableRow className="hover:bg-cyan-600/20" onClick={() => onRegisterClick && onRegisterClick(event)}>
            <TableCell>
                <div className="flex flex-row items-center gap-2">
                    <PlusIcon className="size-5 text-green-500"></PlusIcon>
                    <p className="text-green-500">Register a student</p>
                </div>
            </TableCell>
        </TableRow>
    </TableBody>
    </Table>
)}
