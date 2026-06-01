import { Box, Card, CardContent, Typography, styled } from "@mui/material";

const TitleRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 24,
});

const AccentBar = styled(Box)(({ theme }) => ({
  height: 20,
  width: 4,
  borderRadius: Number(theme.shape.borderRadius),
  backgroundColor: theme.palette.primary.main,
}));

interface Props {
  title: string;
  children: React.ReactNode;
  trailing?: React.ReactNode;
}

export function SectionCard({ title, children, trailing }: Props) {
  return (
    <Card sx={{ mb: 3, borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <TitleRow>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <AccentBar />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {title}
            </Typography>
          </Box>
          {trailing}
        </TitleRow>
        {children}
      </CardContent>
    </Card>
  );
}
