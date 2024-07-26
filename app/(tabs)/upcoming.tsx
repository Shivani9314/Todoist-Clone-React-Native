import React, { useEffect, useState } from "react";
import { Text, Modal, ActivityIndicator } from "react-native";
import { styled } from "nativewind";
import { View as RNView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { completeTask, getAllTasks, selectTasks } from "@/slices/taskSlice";
import { AppDispatch } from "@/store/store";
import CheckBox from "expo-checkbox";
import { isToday, parseISO } from "date-fns";
import { AntDesign } from "@expo/vector-icons";
import CreationModalforAllScreens from "@/components/CreationModalforAllScreens";
import { selectLoader } from "@/slices/LoaderSlice";
import Toast from "react-native-toast-message";

const View = styled(RNView);
const StyledText = styled(Text);

export default function UpcomingScreen() {
  const tasks = useSelector(selectTasks);
  const dispatch = useDispatch<AppDispatch>();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [completedTasks, setCompletedTasks] = useState<{ [key: string]: boolean }>({});
  const loader = useSelector(selectLoader);

  useEffect(() => {
    dispatch(getAllTasks());
  }, [dispatch]);

  const openModal = (task: any = null) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTask(null);
  };

  const upcomingTasks = tasks.filter(
    (task) => task.due?.date && !isToday(parseISO(task.due?.date))
  );

  const handleCheckboxClick = (taskId: string) => {
    dispatch(completeTask(taskId));
    setCompletedTasks((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));
  };

  return (
    <View className="flex-1 p-4 gap-4">
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
      <StyledText className="text-xl font-bold">Upcoming Tasks</StyledText>
      <View className="w-full">
        {upcomingTasks.length > 0 ? (
          upcomingTasks.map((task) => (
            <View
              key={task.id}
              className="bg-white p-4 mb-2 flex flex-row rounded-md shadow-md w-11/12"
            >
              <CheckBox
                value={completedTasks[task.id] || false}
                onValueChange={() => handleCheckboxClick(task.id)}
              />
              <View className="ml-4 flex-1">
                <StyledText className="font-semibold">{task.content}</StyledText>
                {task.description && (
                  <StyledText className="text-gray-500">{task.description}</StyledText>
                )}
                <StyledText className="text-gray-400">Priority: {task.priority}</StyledText>
                <StyledText className="text-gray-400">Due Date: {task.due?.date}</StyledText>
              </View>
            </View>
          ))
        ) : (
          <StyledText>No upcoming tasks</StyledText>
        )}
      </View>
      <View className="absolute bottom-8 right-8">
        <AntDesign
          name="pluscircle"
          size={54}
          color="red"
          onPress={() => openModal()}
        />
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <CreationModalforAllScreens
              closeModal={closeModal}
              task={selectedTask}
              screen="upcoming"
            />
          </View>
        </Modal>
      </View>
      <Toast/>
    </View>
  );
}
