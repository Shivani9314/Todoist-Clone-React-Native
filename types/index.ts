export interface Task {
  id: string;
  content: string;
  projectId: string;
  due?: {
    date: string;
    datetime?: string | null;
  }| null;
  description?: string | null | undefined;
  lable?: string[] | [];
  priority?: number;
}

  export interface Project {
    id: string;
    name: string;
  }

  export interface Lable {
     id: string,
     name : string
  }