export interface Workspace {
    id: string
    name: string
    description?: string
    projects?: Project[]
}

export interface Project {
    id: string
    name: string
}