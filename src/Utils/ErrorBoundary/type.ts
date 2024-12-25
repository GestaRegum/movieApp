interface State {
    hasError: boolean;
    error: Error | null;
  }
  
  interface Props {
    children: React.ReactNode;
  }

  export type { State, Props}