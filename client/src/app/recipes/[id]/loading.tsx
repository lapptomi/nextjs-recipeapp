import { Divider, Skeleton } from "@mui/material";

export default function RecipeLoading() {
  return (
    <div className="flex flex-col items-center justify-center p-10">
      <div className="flex w-full max-w-[1920px] flex-wrap items-center justify-evenly">
        <div>
          <Skeleton variant="text" width={300} height={120} />
          <div className="flex flex-row gap-4">
            <Skeleton variant="circular" height={100} width={100} />
            <Skeleton variant="text" width={180} height={100} />
          </div>
          <Skeleton variant="text" width={300} height={80} />
        </div>
        <Skeleton variant="rectangular" width={440} height={440} />
      </div>

      <div className="flex min-h-[400px] w-full flex-col justify-center gap-10 p-10">
        <Divider />
        <Skeleton variant="rectangular" height={300} />
        <Skeleton variant="rectangular" height={300} />
        <Skeleton variant="rectangular" height={300} />
      </div>
    </div>
  );
}
