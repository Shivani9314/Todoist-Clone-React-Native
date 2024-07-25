import React, { useEffect, useState } from "react";
import { Modal, Text, ActivityIndicator } from "react-native";
import { styled } from "nativewind";
import { View as RNView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  completeTask,
  deleteTask,
  getTasksByProjectId,
  selectTasksById,
} from "@/store/slices/taskSlice";
import { AppDispatch } from "@/store/store";
import { selectProjects } from "@/store/slices/projectSlice";
import CheckBox from "expo-checkbox";
import { format, isToday, isTomorrow, isThisWeek, parseISO } from "date-fns";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import CreateNewTask from "../components/CreateUpdateModal";
import { selectLoader } from "@/store/slices/LoaderSlice";
import { useLocalSearchParams } from "expo-router";

const StyledText = styled(Text);
const View = styled(RNView);

function ProjectDetailsScreen() {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector(selectTasksById);
  const projects = useSelector(selectProjects);
  const loader = useSelector(selectLoader);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [completedTasks, setCompletedTasks] = useState<{ [key: string]: boolean }>({});
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const priorityColors: { [key: number]: string } = {
    1: "gray",
    2: "orange",
    3: "blue",
    4: "red",
  };

  const openModal = () => {
    setSelectedTask(null); 
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  useEffect(() => {
    if (id) {
      dispatch(getTasksByProjectId(id as string));
    }
  }, [id, dispatch]);

  const project = projects.find((project) => project.id === id);

  const handleCheckboxClick = (taskId: string) => {
    dispatch(completeTask(taskId));
    setCompletedTasks((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));
  };

  const handleDeleteTask = async (id: string) => {
    await dispatch(deleteTask(id));
  };

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const formatDueDate = (due: { date: string } | null | undefined): string => {
    if (!due || !due.date) return "";
    const date = parseISO(due.date);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isThisWeek(date)) return format(date, "EEEE");
    return format(date, "MMM d");
  };

  return (
    <View className="p-6 flex-1 relative gap-5">
      {project && (
        <StyledText className="text-2xl font-bold">{project.name}</StyledText>
      )}
      <Modal
        transparent={true}
        animationType="none"
        visible={loader}
      >
        <View className="flex-1 justify-center items-center bg-opacity-50">
          <View className="bg-white p-4 rounded-lg">
            <ActivityIndicator size="large" color="red" />
          </View>
        </View>
      </Modal>
      {tasks && tasks.map((task) => (
        <View
          key={task.id}
          className="flex flex-row bg-white py-4 px-3 shadow-lg rounded-md"
        >
          <CheckBox
            value={completedTasks[task.id] || false}
            onValueChange={() => handleCheckboxClick(task.id)}
            color={priorityColors[task.priority ?? 1]}
          />
          <View className="ml-4 grow">
            <StyledText className="font-semibold text-md">{task.content}</StyledText>
            {task.description && (
              <StyledText className="text-sm text-gray-500">{task.description}</StyledText>
            )}
            {task.due && (
              <StyledText className="text-sm" style={{ color: priorityColors[task.priority ?? 1] }}>
                {formatDueDate(task.due)}
              </StyledText>
            )}
          </View>
          <View>
            <MaterialIcons onPress={() => handleEditTask(task)} name="edit" size={24} color="red" />
          </View>
          <View>
            <MaterialIcons onPress={() => handleDeleteTask(task.id)} name="delete" size={24} color="red" />
          </View>
        </View>
      ))}
      <View className="absolute bottom-16 right-10">
        <AntDesign name="pluscircle" size={54} color="red" onPress={openModal} />
      </View>
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View className="flex-1 justify-center items-center bg-white-800 bg-opacity-50">
          <CreateNewTask closeModal={closeModal} projectId={id as string} task={selectedTask} />
        </View>
      </Modal>
    </View>
  );
}

export default ProjectDetailsScreen;
