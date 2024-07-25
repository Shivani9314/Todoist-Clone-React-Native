import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
  createNewTask as createNewTaskAction,
  updateTask,
} from "@/store/slices/taskSlice";
import { styled } from "nativewind";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { selectProjects } from "@/store/slices/projectSlice";

const StyledTextInput = styled(TextInput);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const priorities = [
  { label: "Priority 1 (Normal)", value: 1 },
  { label: "Priority 2", value: 2 },
  { label: "Priority 3", value: 3 },
  { label: "Priority 4 (Urgent)", value: 4 },
];

type ScreenType = "today" | "upcoming" | "search" | "browse";

interface CreationModalProps {
  closeModal: () => void;
  projectId?: string;
  task?: any;
  todaysdate?: Date;
  screen: ScreenType;
}

const CreationModalforAllScreens: React.FC<CreationModalProps> = ({
  closeModal,
  task,
  todaysdate = new Date(),
  screen,
}) => {
  const [content, setContent] = useState(task?.content ?? "");
  const [description, setDescription] = useState<string>(
    task?.description ?? ""
  );
  const [dueDate, setDueDate] = useState<Date | null>(
    task?.dueDate ? new Date(task.dueDate) : null
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [open, setOpen] = useState(false);
  const [openProject, setOpenProject] = useState(false);
  const [priority, setPriority] = useState<number>(task?.priority ?? 1);
  const projects = useSelector(selectProjects).map((project) => ({
    label: project.name,
    value: project.id,
  }));
  const inboxProject = projects.find((project) => project.label === "Inbox");
  const [project, setProject] = useState<any>(
    task ? task.projectId : inboxProject ? inboxProject.value : null
  );

  const dispatch = useDispatch<AppDispatch>();
  const handleSubmit = async () => {
    let date = "";
    if (screen === "today") {
      date = todaysdate.toISOString();
    } else if (
      screen === "upcoming" ||
      screen === "search" ||
      screen === "browse"
    ) {
      if (dueDate) {
        date = dueDate.toISOString();
      } else {
        date = "";
      }
    }

    const taskData = {
      content,
      projectId: project || (inboxProject ? inboxProject.value : ""),
      description: description || "",
      dueDate: date,
      priority: priority ? priority : 1,
    };

    console.log("Task Data:", taskData);

    try {
      if (task) {
        await dispatch(updateTask({ id: task.id, ...taskData }));
      } else {
        await dispatch(
          createNewTaskAction({ ...taskData, projectId: project })
        );
      }
      closeModal();
    } catch (error) {
      console.error("Error creating/updating task:", error);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentdate =
      screen === "today" ? todaysdate : selectedDate || dueDate;
    setShowDatePicker(Platform.OS === "ios");
    setDueDate(currentdate);
  };

  return (
    <StyledView className="p-4 bg-white rounded-md w-80">
      <StyledTextInput
        className="p-2 border-2 border-gray-200 mb-2 w-full"
        placeholder="Add Content"
        placeholderTextColor="#A0AEC0"
        value={content}
        onChangeText={setContent}
      />
      <StyledTextInput
        className="p-2 border-2 border-gray-200 mb-2 w-full"
        placeholder="Description"
        placeholderTextColor="#A0AEC0"
        value={description}
        onChangeText={setDescription}
      />
      <StyledTouchableOpacity
        className="p-2 border-2 border-gray-200 mb-2 w-full"
        onPress={() => setShowDatePicker(true)}
      >
        <StyledText>
          {screen === "today"
            ? todaysdate.toLocaleDateString()
            : dueDate
            ? dueDate.toLocaleDateString()
            : "Select Due Date"}
        </StyledText>
      </StyledTouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={screen === "today" ? todaysdate : dueDate || new Date()}
          mode={"date"}
          is24Hour={true}
          display="default"
          onChange={onDateChange}
        />
      )}
      <DropDownPicker
        open={open}
        value={priority}
        items={priorities}
        setOpen={setOpen}
        setValue={setPriority}
        setItems={() => {}}
        placeholder="Select Priority"
        containerStyle={{ width: "100%", marginBottom: 10 }}
        style={{
          borderWidth: 1,
          borderColor: "gray",
          borderRadius: 8,
          backgroundColor: "#fff",
        }}
        textStyle={{ textAlign: "left", color: "black" }}
        dropDownContainerStyle={{ backgroundColor: "#fff" }}
        placeholderStyle={{ color: "gray" }}
      />
      <DropDownPicker
        open={openProject}
        value={project}
        items={projects}
        setOpen={setOpenProject}
        setValue={setProject}
        setItems={() => {}}
        placeholder="Select Project"
        containerStyle={{ width: "100%", marginBottom: 10 }}
        style={{
          borderWidth: 1,
          borderColor: "gray",
          borderRadius: 8,
          backgroundColor: "#fff",
        }}
        textStyle={{ textAlign: "left", color: "black" }}
        dropDownContainerStyle={{ backgroundColor: "#fff" }}
        placeholderStyle={{ color: "gray" }}
      />
      <StyledView className="flex-row justify-between">
        <Button
          title={task ? "Edit Task" : "Create Task"}
          onPress={handleSubmit}
        />
        <Button title="Cancel" onPress={closeModal} />
      </StyledView>
    </StyledView>
  );
};

export default CreationModalforAllScreens;
