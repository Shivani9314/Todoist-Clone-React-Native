import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Button,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
  createNewTask as createNewTaskAction,
  updateTask,
} from "@/store/slices/taskSlice";
import { styled } from "nativewind";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";

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

const CreateNewTask: React.FC<{
  closeModal: () => void;
  projectId: string;
  task: any;
}> = ({ closeModal, projectId, task }) => {
  const [content, setContent] = useState(task?.content ?? "");
  const [description, setDescription] = useState<string>(
    task?.description ?? ""
  );
  const [dueDate, setDueDate] = useState<Date | null>(
    task?.dueDate ? new Date(task.dueDate) : null
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [open, setOpen] = useState(false);
  const [priority, setPriority] = useState<number>(task?.priority ?? 1);

  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = () => {
    const taskData = {
      content,
      description: description || undefined,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
      priority,
    };
  
    if (task) {
      dispatch(updateTask({ id: task.id, ...taskData }));
    } else {
      dispatch(createNewTaskAction({ ...taskData, projectId }));
    }
    closeModal();
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(Platform.OS === "ios");
    setDueDate(currentDate || null);
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
          {dueDate ? dueDate.toLocaleDateString() : "Select Due Date"}
        </StyledText>
      </StyledTouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dueDate || new Date()}
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

export default CreateNewTask;
