import Toast from 'react-native-toast-message';

const showToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
  Toast.show({
    type,
    position: 'top',
    text1: title,
    text2: message,
    visibilityTime: 4000,
    autoHide: true,
    topOffset: 30,
    bottomOffset: 40,
  });
};

export default showToast;
