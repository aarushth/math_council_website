"use client";
import { Modal, ModalBody, ModalHeader, Button, Label, TextInput, Checkbox, FloatingLabel, Dropdown, DropdownItem } from "flowbite-react";
import { useState } from "react";


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

export default function RegistrationForm({ event, open, setOpen }: Props) {
  const [name, setName] = useState("");

  function closeModal() {
    setOpen(false);
    setName("");
  }
    return (
        <Modal show={open} size="md" onClose={closeModal} popup >
        <ModalHeader className="bg-cyan-800 rounded-t-lg"/>
        <ModalBody className="bg-cyan-800 rounded-b-lg">
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Register for {event.name}</h3>
            <div>
                <FloatingLabel
                  className="mb-5"
                  variant="filled"
                  label="Student Name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  />
                <Dropdown label="Select Grade Level" className="w-full">
                  <DropdownItem className="py-1">Kindergarten</DropdownItem>
                  <DropdownItem className="py-1">1st Grade</DropdownItem>
                  <DropdownItem className="py-1">2nd Grade</DropdownItem>
                  <DropdownItem className="py-1">3rd Grade</DropdownItem>
                  <DropdownItem className="py-1">4th Grade</DropdownItem>
                  <DropdownItem className="py-1">5th Grade</DropdownItem>
                  <DropdownItem className="py-1">6th Grade</DropdownItem>
                  <DropdownItem className="py-1">7th Grade</DropdownItem>
                  <DropdownItem className="py-1">8th Grade</DropdownItem>
                </Dropdown>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password">Your password</Label>
              </div>
              <TextInput id="password" type="password" required />
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <a href="#" className="text-sm text-primary-700 hover:underline dark:text-primary-500">
                Lost Password?
              </a>
            </div>
            <div className="w-full">
              <Button>Log in to your account</Button>
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
              Not registered?&nbsp;
              <a href="#" className="text-primary-700 hover:underline dark:text-primary-500">
                Create account
              </a>
            </div>
          </div>
        </ModalBody>
      </Modal>
    )}
