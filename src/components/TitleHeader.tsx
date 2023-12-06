import { Typography } from '@mui/material';
import Image from 'next/image';

import styles from '@/styles/TitleHeader.module.css';

const TitleHeader = ({ title }: { title?: string }) => {
  return (
    <div className={styles.header}>
      <Image
        src={"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
        alt="food"
        quality={50}
        layout="fill"
        className={styles.image}
      />
      <div className={styles.headertitle}>
        <Typography variant="h5" color="white">
          {title?.toUpperCase() || ''}
        </Typography>
      </div>
    </div>
  );
};

export default TitleHeader;