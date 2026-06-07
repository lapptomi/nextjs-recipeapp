import { Box, Card, CardContent, Skeleton } from "@mui/material";

const CARD_WIDTH = 280;
const CARD_GAP = 16;

export default function PopularRecipesSkeleton() {
  return (
    <Box
      className="grid justify-center"
      sx={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${CARD_WIDTH}px, ${CARD_WIDTH}px))`,
        gap: `${CARD_GAP}px`,
      }}
    >
      {[...Array(4)].map((_, index) => (
        <Card key={index} sx={{ borderRadius: 3 }}>
          <Skeleton variant="rectangular" height={192} />
          <CardContent>
            <Skeleton variant="text" height={28} width="80%" />
            <Skeleton variant="text" height={20} width="40%" />
            <Skeleton variant="text" height={20} width="60%" />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
