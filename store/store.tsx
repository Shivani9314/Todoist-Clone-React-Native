import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from '../slices/projectSlice';
import taskreducer from '../slices/taskSlice'
import loaderReducer from "@/slices/LoaderSlice";

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    tasks :taskreducer,
    loader:loaderReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
