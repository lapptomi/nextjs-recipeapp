import { Box, Card, CardContent, Skeleton } from "@mui/material";

const CARD_WIDTH = 350;
const CARD_GAP = 24;

export default function RecipeGridSkeleton() {
  return (
    <Box
      className="grid justify-center"
      sx={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${CARD_WIDTH}px, ${CARD_WIDTH}px))`,
        gap: `${CARD_GAP}px`,
      }}
    >
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="w-full overflow-hidden rounded-2xl">
          <Skeleton variant="rectangular" height={288} />
          <CardContent className="flex flex-col gap-3 p-5">
            <Skeleton variant="text" width="80%" height={28} />
            <Skeleton variant="text" width="40%" height={20} />
            <Skeleton variant="rectangular" width={120} height={20} />
            <Box className="flex gap-4">
              <Skeleton variant="text" width={60} height={20} />
              <Skeleton variant="text" width={80} height={20} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
