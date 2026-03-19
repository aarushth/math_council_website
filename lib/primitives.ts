export interface Event {
    id: number
    name: string
    description: string
    date: string
    location: string
    active: boolean
    totalScore: number | null
    questionPdf: string | null
    minGrade: number
    maxGrade: number
    registrations: Registration[]
}
export interface User {
    id: number
    name: string
    email: string
    picture?: string
    admin: boolean
}
export interface Registration {
    id: number
    studentName: string
    grade: number
    eventId: number
    userId: number
    user?: User
    score: number
    scoreReport: boolean[]
}
export const GRADES: Record<number, { label: string; shortLabel: string }> = {
    0: { label: 'Kindergarten', shortLabel: 'KG' },
    1: { label: '1st Grade', shortLabel: '1' },
    2: { label: '2nd Grade', shortLabel: '2' },
    3: { label: '3rd Grade', shortLabel: '3' },
    4: { label: '4th Grade', shortLabel: '4' },
    5: { label: '5th Grade', shortLabel: '5' },
    6: { label: '6th Grade', shortLabel: '6' },
    7: { label: '7th Grade', shortLabel: '7' },
    8: { label: '8th Grade', shortLabel: '8' },
}
