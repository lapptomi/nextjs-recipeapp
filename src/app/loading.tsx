import { CircularProgress, LinearProgress } from "@mui/material";

const Loading = () => {
  return (
    <div>
      <LinearProgress />  
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
        <CircularProgress />
      </div>
    </div>
  );
};

export default Loading;