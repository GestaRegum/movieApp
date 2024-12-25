import { Alert } from 'antd';
import { useNetworkState } from 'react-use';

export const NetworkAlert = () => {
  const state = useNetworkState();

  if (state.online) return;

  return <Alert message="Разрыв соединения" />;
};
