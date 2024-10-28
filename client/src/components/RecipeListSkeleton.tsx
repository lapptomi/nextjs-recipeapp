import { Skeleton } from "@mui/material";

const RecipeListSkeleton = () => {
  return (
    <div className='flex flex-row flex-wrap justify-center gap-4 p-8'>
      {new Array(4).fill(0).map((_, index) => (
        <Skeleton key={index} variant="rectangular" width={300} height={300} />
      ))}
    </div>
  );
};

export default RecipeListSkeleton;