import React from "react";

import { Check } from "@mui/icons-material";
import { Button, Card, CardContent, CardMedia, Divider, Typography } from "@mui/material";

import styles from '@/styles/CardContainer.module.css';

interface Props {
  title: string;
  price: number;
  description: string;
  items?: string[];
}

const CardContainer: React.FC<Props> = (props) => {
  return (
    <Card className={styles.wrapper}>
      <CardMedia className={styles.header}>
        <Typography variant="h4">
          {props.title}
        </Typography>

        <Typography variant="h3" fontWeight="bold">
          ${props.price}
          <Typography display="inline" variant="h5" color="text.secondary">
            / Month
          </Typography>
        </Typography>
        
        <Typography variant="caption">
          {props.description}
        </Typography>
      </CardMedia>
      
      <CardContent className={styles.cardcontent}>
        <Divider />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '30px',
          gap: 5
        }}>
          {['itemitem 1', 'itemitem 2', 'item item 3','itemitem 1', 'itemitem 2', 'item item 3'].map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              gap: '20px',
            }}>
              <Check color="primary" /> 
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

export default CardContainer;