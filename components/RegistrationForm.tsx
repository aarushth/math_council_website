"use client";
import { Modal, ModalBody, ModalHeader, FloatingLabel, Dropdown, DropdownItem, Button } from "flowbite-react";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { useState } from "react";
import { useSession } from "next-auth/react";

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
}

interface Props {
  event: Event;
  open: boolean;                
  setOpen: (v: boolean) => void;
}

export default function RegistrationForm({ event, open, setOpen}: Props) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  // const [showError, setShowError] = useState(false);
  const { data: session, status } = useSession();
  function closeModal() {
    setOpen(false);
    setName("");
  }
  

  const grades = [
    "Kindergarten",
    "1st Grade",
    "2nd Grade",
    "3rd Grade",
    "4th Grade",
    "5th Grade",
    "6th Grade",
    "7th Grade",
    "8th Grade",
  ];
  async function handleSubmit() {
    try {
      console.log(JSON.stringify({
          studentName: name,
          grade: grades.indexOf(grade),
          userId: session?.user.id,
          eventId: event.id
        }))
      const res = await fetch("/api/registration/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: name,
          grade: grades.indexOf(grade),
          userId: session?.user.id,
          eventId: event.id
        }),
      });

      if (!res.ok) throw new Error("Failed to create registration");

      closeModal();
    } catch (err) {
      console.error(err);
      // setShowError(true); // show Flowbite toast
      toast.error('An error ocurred. Please try again later.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        });
    }

  }
    return (
      <>
        <ToastContainer/>
        <Modal show={open} size="md" onClose={closeModal} popup >
        <ModalHeader className="bg-cyan-950 rounded-t-lg"/>
        <ModalBody className="bg-cyan-950 rounded-b-lg">
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-white dark:text-white">Register for {event.name}</h3>
            <div className="space-y-6">

                <FloatingLabel variant="filled" label="Student Name" id="name" value={name} onChange={(e) => setName(e.target.value)} required/>
                
                <Dropdown label={grade || "Select Grade Level"} className="w-full" size="lg" outline>
                  {grades.map((g) => (
                    <DropdownItem key={g} onClick={() => setGrade(g)} className="py-1">{g}</DropdownItem>
                  ))}
                </Dropdown>

                <Button className="w-full mt-20" color="green" size="lg" onClick={ () => {handleSubmit()}}>
                  Submit
                </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
      
      </>
    )}
