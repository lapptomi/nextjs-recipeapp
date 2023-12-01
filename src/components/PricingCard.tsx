import React from "react";

import { Check } from "@mui/icons-material";
import { Button, Card, CardContent, CardMedia, Divider, Typography } from "@mui/material";

import styles from '@/styles/PricingCard.module.css';

interface Props {
  title: string;
  price?: number;
  description: string;
  items?: string[];
}

const PricingCard: React.FC<Props> = (props) => {
  return (
    <Card className={styles.wrapper}>
      <CardMedia className={styles.header}>
        <Typography variant="h4">{props.title}</Typography>

        {props.price ? (
          <div style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'baseline'
          }}>
            <Typography variant="h3" fontWeight="bold" color="primary">
              ${props.price}
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="text.secondary">
              / month
            </Typography>
          </div>
        ) : (
          <Typography variant="h3" fontWeight="bold">Free</Typography>
        )}

        <Typography variant="body1"> {props.description}</Typography>
      </CardMedia>
      
      <CardContent className={styles.cardcontent}>
        <Divider />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '30px',
          gap: 5
        }}>
          {'Some Random Text.'.repeat(4).split(' ').map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '20px' }}>
              <Check /> 
              <Typography>
                {item}
              </Typography>
            </div>
          ))}
        </div>        

        <Button size="small" variant="contained" href='/recipes' color="primary">
          Get Started
        </Button>
      </CardContent>
    </Card>
  );
};

export default PricingCard;