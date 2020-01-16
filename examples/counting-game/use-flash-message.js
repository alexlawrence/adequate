const { u: useState } = window.adequate;

const useFlashMessage = delay => {
  const [message, setMessage] = useState('');
  const showMessage = (newMessage, callback) => {
    setMessage(newMessage);
    setTimeout(() => {
      setMessage('');
      callback && callback();
    }, delay);
  };
  return [message, showMessage];
};

export default useFlashMessage;
