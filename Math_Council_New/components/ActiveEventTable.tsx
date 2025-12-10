"use client";
import { FaCalendar, FaMapMarkerAlt, FaPlus } from "react-icons/fa";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@heroui/table";
import { useState } from "react";
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

interface Registration{
  id:number
  studentName: string
  grade: number
  eventId: number
}
interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  Registration: Registration[];
}

interface Props {
  event: Event;
  onRegisterClick?: (event: Event) => void;
}


export default function ActiveEventTable({ event, onRegisterClick }: Props) {
  const columns = [
    {
      key: "studentName",
      label: "Student Name",
    },
    {
      key: "grade",
      label: "Grade",
    }
  ];
  console.log(event.Registration);
  if(!event.Registration){
    return <p>No registrations</p>;
  }else{
  return (
    <Table aria-label="Example table with dynamic content" topContent={
        <>
            <p className="block text-xl text-white">{event.name}</p>
            <p className="block text-xs my-1000 text-white/60 text-body">{event.description}</p>
            
            <div className="flex flex-row gap-4">
                <FaCalendar className="size-4 text-white/80"></FaCalendar>
                <p className="text-sm text-white/80 font-normal text-body text-center">{formatEventDate(event.date)}</p>
            </div>
            <div className="flex flex-row gap-4">
                <FaMapMarkerAlt className="size-4 text-white/80"></FaMapMarkerAlt>
                <p className="text-sm text-white/80 font-normal text-body">Location</p>
            </div>
        </>
    }
    bottomContent={
        <div className="flex flex-row items-center gap-2">
            <FaPlus className="size-5 text-green-500"></FaPlus>
            <p className="text-green-500">Register a{event.Registration.length != 0 && "nother"} student</p>
        </div>
    }>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={event.Registration || []}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
          </TableRow>
        )}
        
        
      </TableBody>
    </Table>
  )
}
}
{/* <Table className="overflow-hidden">
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
        <TableBody>
          <TableRow>
            <TableCell className="p-0">
              <Table>
                {event.registrations.length != 0 && 
                  <TableHead className="">
                    <TableRow>
                      <TableHeadCell>Registered Students</TableHeadCell>
                      <TableHeadCell></TableHeadCell>
                      <TableHeadCell></TableHeadCell>
                    </TableRow>
                  </TableHead>
                }
                  <TableBody className="bg-cyan-50 rounded-b-xl">
                  {event.registrations.map((registration) => (
                    <TableRow key={registration.id} className="hover:bg-cyan-600/20" onClick={() => onRegisterClick && onRegisterClick(event)}>
                        <TableCell>{registration.studentName}</TableCell>
                        <TableCell>{registration.grade}</TableCell>
                        <TableCell>Delete</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableCell>
          </TableRow>
          <TableRow className="hover:bg-cyan-600/20" onClick={() => onRegisterClick && onRegisterClick(event)}>
              <TableCell>
                <div className="flex flex-row items-center gap-2">
                  <PlusIcon className="size-5 text-green-500"></PlusIcon>
                  <p className="text-green-500">Register a{event.registrations.length != 0 && "nother"} student</p>
                </div>
              </TableCell>
            </TableRow>
        </TableBody>
    </Table> */}

