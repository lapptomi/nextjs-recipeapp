import { Check } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Typography,
} from "@mui/material";

import { ROUTES } from "@/types";

interface Props {
  title: string;
  price?: number;
  description: string;
}

const PricingCard = (props: Props) => {
  return (
    <Card className="flex min-w-[350px] max-w-[350px] flex-col">
      <CardMedia className="flex flex-col p-6">
        <Typography variant="h4">{props.title}</Typography>
        {props.price ? (
          <Box className="flex gap-2 align-baseline">
            <Typography variant="h3" fontWeight="bold" color="primary">
              ${props.price}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              / month
            </Typography>
          </Box>
        ) : (
          <Typography variant="h3" fontWeight="bold">
            Free
          </Typography>
        )}
        <Typography variant="body1" color="text.secondary">
          {props.description}
        </Typography>
      </CardMedia>

      <CardContent className="flex flex-col">
        <Divider />

        <Box className="flex flex-col p-6">
          {Array(5)
            .fill("Hello world")
            .map((item, index) => (
              <Box key={index} className="flex gap-2">
                <Check />
                <Typography>{item}</Typography>
              </Box>
            ))}
        </Box>

        <Button
          size="small"
          variant="contained"
          href={ROUTES.RECIPES}
          color="primary"
        >
          Get Started
        </Button>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
