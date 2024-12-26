import { Alert } from 'antd';
import { useNetworkState } from 'react-use';
import React from 'react';

export const NetworkAlert = () => {
  const state = useNetworkState();

  if (state.online) return;

  return <Alert message="Разрыв соединения" />;
};
