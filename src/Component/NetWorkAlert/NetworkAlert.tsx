import { Alert } from 'antd';
import { useNetworkState } from 'react-use';

const NetworkAlert = () => {
  const state = useNetworkState();

  if (state.online) return;

  return <Alert message={'Разрыв соединения'} />;
};

export { NetworkAlert };
