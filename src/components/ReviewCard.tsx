import React from "react";

import { Avatar, Card, CardContent, Rating, Typography } from "@mui/material";

import styles from '@/styles/ReviewCard.module.css';

interface Props {
  username: string;
  title: string;
  description: string;
}

const ReviewCard: React.FC<Props> = ({ username ,title, description }) => {
  return (
    <Card className={styles.wrapper}>
      <CardContent>
        <div className={styles.ratingwrapper}>
          <Avatar />
          <div>
            <Typography variant="body1">{username}</Typography>
            <Rating readOnly value={2}  />
          </div>
        </div>
        <Typography variant="body1" color="secondary">
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;