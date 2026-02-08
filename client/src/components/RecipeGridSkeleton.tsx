import { Card, Skeleton, CardContent } from "@mui/material";
import { Box } from "@mui/system";

export default function RecipeGridSkeleton({
  cardWidth,
  cardGap,
}: {
  cardWidth: number;
  cardGap: number;
}) {
  return (
    <Box
      className="grid justify-center"
      sx={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${cardWidth}px, ${cardWidth}px))`,
        gap: `${cardGap}px`,
      }}
    >
      {[...Array(6)].map((_, index) => (
        <Card key={index} sx={{ borderRadius: 3 }}>
          <Skeleton variant="rectangular" height={224} />
          <CardContent>
            <Skeleton variant="text" height={28} width="80%" />
            <Skeleton variant="text" height={20} width="60%" className="my-2" />
            <Skeleton variant="text" height={20} width="40%" />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
