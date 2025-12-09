"use client";

import { useState } from "react";

interface Props {
  eventId: number;
  userId: number;
}

interface StudentForm {
  student: string;
}

export default function RegistrationForm({ eventId }: Props) {
  const [students, setStudents] = useState<StudentForm[]>([{ student: ""}]);

  function addStudent() {
    setStudents(prev => [...prev, { student: ""}]);
  }

  function updateStudent(index: number, field: keyof StudentForm, value: any) {
    const updated = [...students];
    updated[index][field] = value;
    setStudents(updated);
  }

  function submitForm() {
    console.log("Submitting registration for event:", eventId);
    console.log(students);

    // TODO: POST to an API route
    // await fetch("/api/register", { method: "POST", body: JSON.stringify(...) })
  }

  return (
    <div className="border p-6 rounded-lg bg-white shadow-md">
      <h3 className="text-xl font-semibold mb-4">Register Students</h3>
      <div className="space-y-6">
        {students.map((form, i) => (
          <div key={i} className="p-4 border rounded-md">
            <h4 className="font-medium mb-3">Student {i + 1}</h4>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Student Name"
                value={form.student}
                onChange={(e) => updateStudent(i, "student", e.target.value)}
                className="border p-2 rounded"
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addStudent}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        + Add Another Student
      </button>
      <button
        onClick={submitForm}
        className="mt-4 ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Submit Registration
      </button>
    </div>
  );
}
