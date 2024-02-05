import { Typography } from '@mui/material';

import styles from '@/styles/TitleHeader.module.css';

const TitleHeader = ({ title }: { title: string }) => {
  return (
    <div className={styles.header}>
      <div className={styles.headertitle}>
        <Typography variant="h5" fontWeight="medium">
          {title.toUpperCase()}
        </Typography>
      </div>
    </div>
  );
};

export default TitleHeader;