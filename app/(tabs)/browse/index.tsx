import React, { useEffect, useState } from "react";
import { Text, FlatList, TextInput, Button, Modal, ActivityIndicator } from "react-native";
import { styled } from "nativewind";
import { View as RNView } from "react-native";
import { Octicons, Ionicons, FontAwesome, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProjects,
  selectProjects,
  createNewProject,
  deleteProject,
} from "../../../slices/projectSlice";
import { AppDispatch } from "../../../store/store";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import CreationModalforAllScreens from "@/components/CreationModalforAllScreens";
import { selectLoader } from "@/slices/LoaderSlice";
import Toast from "react-native-toast-message";

const View = styled(RNView);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);

export default function BrowseScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const projects = useSelector(selectProjects);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newProjectName, setNewProjectName] = useState<string>("");
  const router = useRouter();
  const [isTaskModalVisible, setTaskModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const loader = useSelector(selectLoader);

  useEffect(() => {
    dispatch(fetchProjects());
  }, []);

  const handleCreate = () => {
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (projects.length < 8) {
      const newProject = await dispatch(createNewProject(newProjectName)).unwrap();
      setNewProjectName("");
      setModalVisible(false);
    } else {
      console.log("Limit exceeded");
    }
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteProject(id));
  };

  const handlePressProject = (id: string) => {
    router.push(`/project-details?id=${id}`);
  };

  const openModal = (task: any = null) => {
    setSelectedTask(task);
    setTaskModalVisible(true);
  };

  const closeModal = () => {
    setTaskModalVisible(false);
    setSelectedTask(null);
  };

  const filteredProjects = projects.filter((project) => project.name !== 'Inbox');
  const inboxProject = projects.find((project) => project.name === "Inbox");

  return (
    <View className="flex-1">
      {loader && (
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
      )}
      <View className="flex-1 p-4 gap-10">
        <View className="py-2 flex bg-white shadow-lg rounded-md">
          <View className="px-3 flex flex-row gap-4 mb-2 items-center">
            <Octicons name="inbox" size={24} color="red" />
            {inboxProject && (
              <StyledText className="text-lg" onPress={() => handlePressProject(inboxProject.id.toString())}>
                Inbox
              </StyledText>
            )}
          </View>
          <View className="px-3 flex flex-row gap-4 items-center">
            <Ionicons name="grid-outline" size={24} color="red" />
            <StyledText className="text-lg">Filter & Labels</StyledText>
          </View>
        </View>
        <View className="px-0 shadow-lg">
          <View className="flex flex-row items-center">
            <StyledText className="text-xl px-2 py-2 grow">My Projects</StyledText>
            <StyledText onPress={handleCreate}>
              <Feather name="plus" size={24} color="black" />
            </StyledText>
          </View>
          <FlatList
            data={filteredProjects}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View className="py-2 border-b border-gray-200 bg-white flex flex-row px-3 rounded-md items-center">
                <StyledText
                  onPress={() => handlePressProject(item.id.toString())}
                  className="text-lg grow text-gray-900"
                >
                  # {item.name}
                </StyledText>
                <StyledText onPress={() => handleDelete(item.id.toString())}>
                  <MaterialCommunityIcons name="delete" size={18} color="red" />
                </StyledText>
              </View>
            )}
          />
        </View>
        <View className="flex flex-row items-center px-2 bg-white py-2 rounded-md shadow-lg">
          <FontAwesome name="pencil" size={24} color="black" />
          <StyledText className="ml-2 text-lg">Manage Projects</StyledText>
        </View>
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-opacity-50">
            <View className="bg-white p-6 rounded-md shadow-lg">
              <StyledText className="text-lg mb-4">Create New Project</StyledText>
              <StyledTextInput
                value={newProjectName}
                onChangeText={setNewProjectName}
                placeholder="Enter project name"
                className="border border-gray-300 p-2 mb-4 rounded-md"
              />
              <Button title="Create" onPress={handleSubmit} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
        <View className="absolute bottom-8 right-8">
          <AntDesign
            name="pluscircle"
            size={54}
            color="red"
            onPress={() => openModal(selectedTask)}
          />
          <Modal
            visible={isTaskModalVisible}
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
      <Toast/>
    </View>
  );
}
