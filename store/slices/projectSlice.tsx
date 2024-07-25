import { createProject, deleteProjectApi, getProjects } from "@/services/api";
import { Project } from "@/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { hideLoader, showLoader } from "./LoaderSlice";
import showToast from "@/utils/toast";

interface ProjectsState {
  projects: Project[];
}

const initialState: ProjectsState = {
  projects: [],
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { dispatch }) => {
    try {
      dispatch(showLoader());
      const response = await getProjects();
      return response;
    } catch (error) {
      showToast('error', 'Unable to fetch', 'Please try again.');
      throw new Error((error as Error).message || "Failed to fetch projects");
    } finally {
      dispatch(hideLoader());
    }
  }
);

export const createNewProject = createAsyncThunk(
  "projects/createNewProject",
  async (name: string, { dispatch }) => {
    try {
      dispatch(showLoader());
      const response = await createProject(name);
      showToast('success', 'Project created Successfully', '');
      return response;
    } catch (error) {
      showToast('error', 'Unable to create project', 'Please try again.');
      throw new Error((error as Error).message || "Failed to create project");
    } finally {
      dispatch(hideLoader());
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id: string, { dispatch }) => {
    try {
      dispatch(showLoader());
      await deleteProjectApi(id);
      return id;
    } catch (error) {
      showToast('error', 'Unable to delete project', 'Please try again.');
      throw new Error((error as Error).message || "Failed to delete project");
    } finally {
      dispatch(hideLoader());
    }
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchProjects.fulfilled,
        (state, action: PayloadAction<Project[]>) => {
          state.projects = action.payload;
        }
      )
      .addCase(
        createNewProject.fulfilled,
        (state, action: PayloadAction<Project>) => {
          state.projects.push(action.payload);
        }
      )
      .addCase(
        deleteProject.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.projects = state.projects.filter(
            (project) => project.id !== action.payload
          );
        }
      );
  },
});

export const selectProjects = (state: { projects: ProjectsState }) =>
  state.projects.projects;

export default projectsSlice.reducer;
