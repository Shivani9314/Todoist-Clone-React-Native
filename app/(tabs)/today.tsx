import React, { useEffect, useState } from "react";
import { Text, Modal, View as RNView } from "react-native";
import { styled } from "nativewind";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTasks,
  selectTasks,
  completeTask,
  deleteTask,
  selectTasksById,
} from "@/store/slices/taskSlice";
import CheckBox from "expo-checkbox";
import { AppDispatch } from "@/store/store";
import { AntDesign } from "@expo/vector-icons";
import { fetchProjects, selectProjects } from "@/store/slices/projectSlice";
import { isToday, parseISO} from "date-fns";
import { MaterialIcons } from '@expo/vector-icons';
import CreationModalforAllScreens from "@/components/CreationModalforAllScreens";

const View = styled(RNView);
const StyledText = styled(Text);

export default function TodayScreen() {
  const tasks = useSelector(selectTasks);
  const taskById = useSelector(selectTasksById)
  const dispatch = useDispatch<AppDispatch>();
  const [completedTasks, setCompletedTasks] = useState<{ [key: string]: boolean }>({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const projects = useSelector(selectProjects);

  useEffect(() => {
    dispatch(getAllTasks());
  }, [taskById]);

  useEffect(() => {
    dispatch(fetchProjects());
  }, []);

  const todaysTask = tasks.filter(
    (task) => task.due?.date && isToday(parseISO(task.due?.date))
  );

  const projectName = (projectId: string) => {
    const project = projects.find((project) => project.id === projectId);
    return project ? project.name : "No Project";
  };

  const handleCheckboxClick = (taskId: string) => {
    dispatch(completeTask(taskId));
    setCompletedTasks((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));
  };

  const openModal = (task: any = null) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = async (id: string) => {
    await dispatch(deleteTask(id));
  };

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  return (
    <View className="flex-1 p-4 gap-4">
      <StyledText className="text-xl font-bold">Today's Tasks</StyledText>
      <View className="w-full">
        {todaysTask.length > 0 ? (
          todaysTask.map((task) => (
            <View
              key={task.id}
              className="bg-white p-4 mb-2 flex flex-row rounded-md shadow-md w-11/12"
            >
              <CheckBox
                value={completedTasks[task.id] || false}
                onValueChange={() => handleCheckboxClick(task.id)}
              />
              <View className="ml-3 flex-1">
                <StyledText className="font-semibold">{task.content}</StyledText>
                {task.description && (
                  <StyledText className="text-gray-500">
                    {task.description}
                  </StyledText>
                )}
                <StyledText className="text-gray-400">
                  Priority: {task.priority}
                </StyledText>
                <StyledText># {projectName(task.projectId.toString())}</StyledText>
              </View>
              <View>
                <MaterialIcons onPress={() => handleEditTask(task)} name="edit" size={24} color="red" />
              </View>
              <View>
                <MaterialIcons onPress={() => handleDeleteTask(task.id)} name="delete" size={24} color="red" />
              </View>
            </View>
          ))
        ) : (
          <StyledText>No tasks for today</StyledText>
        )}
      </View>
      <View className="absolute bottom-8 right-8">
        <AntDesign
          name="pluscircle"
          size={54}
          color="red"
          onPress={() => openModal(selectedTask)}
        />
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View className="flex-1 justify-center items-center bg-white-800 bg-opacity-100">
            <CreationModalforAllScreens
              closeModal={closeModal}
              task={selectedTask}
              todaysdate={new Date()}
              screen = {"today"}
            />
          </View>
        </Modal>
      </View>
    </View>
  );
}
