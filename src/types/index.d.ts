export interface IUser {
    email: string
    name: string
    password: string
}

export interface ITask {
    _id: string
    name: string
    user: string
    isCompleted: boolean
    isEditable: boolean
    date: string
    createdAt: string
    updatedAt: string
}
