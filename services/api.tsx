import { TodoistApi } from "@doist/todoist-api-typescript";
import { Task, Project } from "../types";

const API_TOKEN = "93cbf3cd0d3af3b03074b6eedd37fea2f8adc471";
const api = new TodoistApi(API_TOKEN);

export const getProjects = async (): Promise<Project[]> => {
  try {
    const projects = await api.getProjects();
    return projects.map((project) => ({
      id: project.id,
      name: project.name,
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const createProject = async (name: string): Promise<Project> => {
  const requestId = API_TOKEN;

  try {
    const response = await api.addProject({ name }, requestId);
    return response;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const deleteProjectApi = async (id: string): Promise<void> => {
  try {
    await api.deleteProject(id);
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const getTaskByProject = async (id?: string): Promise<Task[]> => {
  try {
    const tasks = id
      ? await api.getTasks({ projectId: id })
      : await api.getTasks();

    return tasks.map((task) => ({
      id: task.id,
      content: task.content,
      projectId: task.projectId,
      due: task.due
        ? {
            date: task.due.date,
            datetime: task.due.datetime ?? "", // Ensure datetime is a string, or default to an empty string if undefined
          }
        : undefined, 
      description: task.description || "",
      lable: task.labels || [],
      priority: task.priority,
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};



export const completeTaskApi = async (id: string): Promise<void> => {
  const requestId = API_TOKEN;
  try {
    await api.closeTask(id, requestId);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const createNewTaskApi = async ({
  content,
  projectId,
  lable,
  description,
  dueDate,
  priority,
}: {
  content: string;
  projectId: string;
  lable?: string[];
  description?: string | null;
  dueDate?: string;
  priority?: number;
}): Promise<Task> => {
  const requestId = API_TOKEN;
  try {
    const response = await api.addTask(
      {
        content,
        projectId,
        labels: lable || [],
        description: description || undefined,
        dueDate: dueDate || "", // Ensure dueDate is a string
        priority,
      },
      requestId
    );

    // Transform response to match Task interface
    const task: Task = {
      id: response.id,
      content: response.content,
      projectId: response.projectId,
      due: response.due
        ? {
            date: response.due.date,
            datetime: response.due.datetime ?? "", // Ensure datetime is a string or default to an empty string
          }
        : null, // Handle the case where due might be null
      description: response.description || "",
      lable: response.labels || [],
      priority: response.priority,
    };

    console.log(task);
    return task;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};


export const deleteTaskApi = async (id: string) => {
  try {
    await api.deleteTask(id);
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const getUsersLable = async () => {
  try {
    const response = await api.getLabels();
    return response;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const updateTaskApi = async ({
  id,
  content,
  lable,
  description,
  dueDate,
  priority,
}: {
  id: string;
  content?: string;
  lable?: string[];
  description?: string | null;
  dueDate?: string;
  priority?: number;
}): Promise<Task> => {
  const requestId = API_TOKEN;
  try {
    const response = await api.updateTask(
      id,
      {
        content,
        labels: lable || [],
        description: description || undefined,
        dueDate: dueDate || "",
        priority,
      },
      requestId
    );
    return response;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

