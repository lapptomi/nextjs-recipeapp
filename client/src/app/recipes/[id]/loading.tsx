import { Box, Divider, Skeleton } from "@mui/material";

export default function RecipeLoading() {
  return (
    <Box className="flex flex-col items-center justify-center p-10">
      <Box className="flex w-full max-w-[1920px] flex-wrap items-center justify-evenly">
        <Box>
          <Skeleton variant="text" width={300} height={120} />
          <Box className="flex flex-row gap-4">
            <Skeleton variant="circular" height={100} width={100} />
            <Skeleton variant="text" width={180} height={100} />
          </Box>
          <Skeleton variant="text" width={300} height={80} />
        </Box>
        <Skeleton variant="rectangular" width={440} height={440} />
      </Box>

      <Box className="flex min-h-[400px] w-full flex-col justify-center gap-10 p-10">
        <Divider />
        <Skeleton variant="rectangular" height={300} />
        <Skeleton variant="rectangular" height={300} />
        <Skeleton variant="rectangular" height={300} />
      </Box>
    </Box>
  );
}
