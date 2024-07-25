import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  completeTaskApi,
  createNewTaskApi,
  deleteTaskApi,
  getTaskByProject,
  updateTaskApi,
} from "../../services/api";
import { Task } from "@/types";
import { hideLoader, showLoader } from "./LoaderSlice";

interface TasksState {
  tasks: Task[];
  tasksById:Task[];
}

const initialState: TasksState = {
  tasks: [],
  tasksById :[],
};

interface CreateTaskParams {
    content: string;
    projectId: string;
    lable?: string[];
    description?: string | null;
    dueDate: string | undefined;
    priority?: number;
};

interface UpdateTaskParams {
  id: string;
  content?: string;
  lable?: string[];
  description?: string | null;
  dueDate?: string;
  priority?: number;
}

export const getTasksByProjectId = createAsyncThunk(
  "tasks/fetchTasks",
  async (projectId: string, { dispatch }) => {
    try {
      dispatch(showLoader());
      const response = await getTaskByProject(projectId);
      return response;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    } finally {
      dispatch(hideLoader());
    }
  }
);

export const getAllTasks = createAsyncThunk(
  "tasks/fetchAllTasks",
  async (_, { dispatch }) => {
    try {
      dispatch(showLoader());
      const response = await getTaskByProject();
      return response;
    } catch (error) {
      console.error("Error fetching all tasks:", error);
      throw error;
    } finally {
      dispatch(hideLoader());
    }
  }
);

export const completeTask = createAsyncThunk(
  "tasks/completeTask",
  async (id: string, { dispatch }) => {
    try {
      dispatch(showLoader());
      await completeTaskApi(id);
      return id;
    } catch (error) {
      console.error("Error completing task:", error);
      throw error;
    } finally {
      dispatch(hideLoader());
    }
  }
);

export const createNewTask = createAsyncThunk<Task, CreateTaskParams>(
    "tasks/createNewTask",
    async ({ content, projectId, lable, description, dueDate, priority }, {dispatch}) => {
      try {
        const response = await createNewTaskApi({
          content,
          projectId,
          lable,
          description,
          dueDate,
          priority,
        });
        return response;
      } catch (error) {
        console.error("Error creating task:", error);
        throw error;
      }finally{
        dispatch(hideLoader())
      }
    }
  );

export const deleteTask = createAsyncThunk('tasks/deleteTask' , async(id:string) =>{
    await deleteTaskApi(id);
    return id;
})

export const updateTask = createAsyncThunk<Task, UpdateTaskParams>(
  'tasks/updateTask',
  async ({ id, content, lable, description, dueDate, priority }) => {
    const reponse = await updateTaskApi({
      id,
      content,
      lable,
      description,
      dueDate,
      priority,
    });
    return reponse;
  }
);



const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getTasksByProjectId.fulfilled,
        (state, action: PayloadAction<Task[]>) => {
          state.tasksById = action.payload;
        }
      )
      .addCase(
        completeTask.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.tasks = state.tasks.filter(
            (task) => task.id !== action.payload
          );
        }
      )
      .addCase(
        createNewTask.fulfilled,
        (state, action: PayloadAction<Task>) => {
          state.tasksById.push(action.payload);
        }
      )
      .addCase(deleteTask.fulfilled, (state, action:PayloadAction<string>) =>{
        state.tasksById = state.tasksById.filter((task) => task.id !== action.payload);
      })
      .addCase(getAllTasks.fulfilled, (state, action:PayloadAction<Task[]>) =>{
        state.tasks = action.payload;
      })
    
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        let index = state.tasksById.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasksById[index] = action.payload;
        }
        index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
  },
});

export const selectTasks = (state: { tasks: TasksState }) => state.tasks.tasks;
export const selectTasksById = (state: { tasks: TasksState }) => state.tasks.tasksById;
export default taskSlice.reducer;
