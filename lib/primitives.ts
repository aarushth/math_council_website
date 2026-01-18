export interface Event {
    id: number
    name: string
    description: string
    date: string
    location: string
    active: boolean
    totalScore: number | null
    questionPdf: string | null
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
