import React, { useState } from "react";
import { Text, TextInput } from "react-native";
import { styled } from "nativewind";
import { View as RNView, ScrollView, Modal } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { selectProjects } from "@/store/slices/projectSlice";
import { completeTask, selectTasks } from "@/store/slices/taskSlice";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import CreationModalforAllScreens from "@/components/CreationModalforAllScreens";
import CheckBox from "expo-checkbox";

const View = styled(RNView);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const projects = useSelector(selectProjects);
  const tasks = useSelector(selectTasks);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [completedTasks, setCompletedTasks] = useState<{
    [key: string]: boolean;
  }>({});
  const dispatch = useDispatch();
  const router = useRouter();

  const searchedProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const searchedTasks = tasks.filter((task) =>
    task.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePressProject = (id: string) => {
    router.push(`/project-details?id=${id}`);
  };

  const openModal = (task: any = null) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTask(null);
  };

  const handleCheckboxClick = (taskId: string) => {
    dispatch(completeTask(taskId)as any);
    setCompletedTasks((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));
  };

  return (
    <View className="flex-1 p-4">
      <StyledTextInput
        className="p-2 border-2 border-gray-400 mb-2 p-4 w-full"
        placeholder="Search Task and projects......"
        placeholderTextColor="#A0AEC0"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {searchQuery && (
        <ScrollView>
          {searchedProjects.length > 0 && (
            <>
              <StyledText className="font-bold text-lg mt-2">
                Projects:
              </StyledText>
              {searchedProjects.map((project) => (
                <StyledText
                  onPress={() => handlePressProject(project.id.toString())}
                  key={project.id}
                  className="p-4 font-bold shadow-lg mt-2 border-b bg-white border-gray-200"
                >
                  {project.name}
                </StyledText>
              ))}
            </>
          )}
          {searchedTasks.length > 0 && (
            <>
              <StyledText className="font-bold text-lg mt-2">Tasks:</StyledText>
              {searchedTasks.map((task) => (
                <View key={task.id} className="flex flex-row border-b items-center px-2 shadow-lg bg-white  border-gray-200">
                  <CheckBox
                    value={completedTasks[task.id] || false}
                    onValueChange={() => handleCheckboxClick(task.id)}
                  />
                  <StyledText
                    key={task.id}
                    className="p-4 font-bold border-b shadow-lg bg-white  border-gray-200"
                  >
                    {task.content}
                  </StyledText>
                </View>
              ))}
            </>
          )}
          {searchedProjects.length === 0 && searchedTasks.length === 0 && (
            <StyledText className="text-center mt-4">
              No results found
            </StyledText>
          )}
        </ScrollView>
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
