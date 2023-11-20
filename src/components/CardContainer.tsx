"use client";

import { Avatar, Button, Card, CardContent, CardMedia, Divider, Rating, Typography } from "@mui/material";
import styles from '@/styles/CardContainer.module.css';

const CardContainer = () => {
  return (
    <Card className={styles.wrapper}>
      <CardMedia className={styles.header} />
      <CardContent className={styles.cardcontent}>
        <div className={styles.ratingwrapper}>
          <Avatar />
          <div>
            <Typography variant="body2">Username</Typography>
            <Rating
              readOnly
              size="small"
              name="simple-controlled"
              value={2}
            />
          </div>
        </div>

        <div>
          <Typography variant="body1">
            Chicken Soup
          </Typography>
          <Typography variant="caption">
            Random Description
          </Typography>
        </div>
        <Divider />
        <Typography variant="subtitle1">
          Instructions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica ...
        </Typography>
        <Button>
          <Typography variant="caption" color="secondary">Read More</Typography>
        </Button>
      </CardContent>
    </Card>
  );
};

export default CardContainer;