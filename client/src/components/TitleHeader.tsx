import { Box, Typography } from "@mui/material";

const TitleHeader = ({ title }: { title: string }) => {
  return (
    <Box className="flex flex-col items-center justify-center bg-gray-100">
      <Box className="flex h-[200px] items-center justify-center">
        <Typography variant="h5">{title.toUpperCase()}</Typography>
      </Box>
    </Box>
  );
};

export default TitleHeader;
