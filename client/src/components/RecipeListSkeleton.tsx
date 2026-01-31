import { Box, Skeleton } from "@mui/material";

const RecipeListSkeleton = () => {
  return (
    <Box display="flex" justifyContent="center" flexWrap="wrap">
      <Box className="grid w-full max-w-[1500px] grid-cols-auto-fill-300 justify-center gap-2 px-2 py-10">
        {new Array(4).fill(0).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            className="h-[300px] w-full"
          />
        ))}
      </Box>
    </Box>
  );
};

export default RecipeListSkeleton;
