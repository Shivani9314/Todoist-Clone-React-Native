import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { styled } from "nativewind";
import { View as RNView, Modal } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { completeTask, getAllTasks, selectTasks } from "@/store/slices/taskSlice";
import { isToday, parseISO } from "date-fns";
import { AppDispatch } from "@/store/store";
import CheckBox from "expo-checkbox";
import { AntDesign } from "@expo/vector-icons";
import CreationModalforAllScreens from "@/components/CreationModalforAllScreens";

const View = styled(RNView);
const StyledText = styled(Text);

export default function UpcomingScreen() {
  const tasks = useSelector(selectTasks);
  const dispatch = useDispatch<AppDispatch>();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [completedTasks, setCompletedTasks] = useState<{
    [key: string]: boolean;
  }>({});
  
  useEffect(() => {
    dispatch(getAllTasks());
  }, []);

  const openModal = (task: any = null) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTask(null);
  };

  const todaysTask = tasks.filter(
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
      <StyledText className="text-xl font-bold">Upcoming Tasks</StyledText>
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
            <View className="ml-4">
            <StyledText className="font-semibold">{task.content}</StyledText>
            {task.description && (
              <StyledText className="text-gray-500">
                {task.description}
              </StyledText>
            )}
            <StyledText className="text-gray-400">
              Priority: {task.priority}
            </StyledText>
            <StyledText className="text-gray-400">
              Due Date: {task.due?.date}
            </StyledText>
            </View>
          </View>
        ))
      ) : (
        <Text>No tasks</Text>
      )}
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
              screen="upcoming"
            />
          </View>
        </Modal>
      </View>
    </View>
  );
}