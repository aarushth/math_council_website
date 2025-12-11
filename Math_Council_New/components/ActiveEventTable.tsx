"use client";
import { FaCalendar, FaMapMarkerAlt, FaPlus } from "react-icons/fa";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@heroui/table";
import { Event } from "@/components/primitives";
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
    },
    {
      key: "delete",
      label: "",
    }
  ];
  if(!event){
    return <p>No upcoming events</p>;
  }else{
    
  return (
    <Table aria-label={event.name + " table"} topContent={
        <>
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
        </>
    }
    bottomContent={
        <div className="cursor-pointer text-green-500 flex flex-row items-center gap-2 p-2 rounded-xl hover:bg-green-500 hover:text-black" onClick={() => onRegisterClick && onRegisterClick(event)}>
            <FaPlus className="size-5"></FaPlus>
            <p>Register a{event.registrations.length != 0 && "nother"} student</p>
        </div>
    }>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={event.registrations || []}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{columnKey === "grade" ? item.grade === 0
                                          ? "KG" : item.grade : getKeyValue(item, columnKey)}
                                        </TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
}


