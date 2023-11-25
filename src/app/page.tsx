/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { Button } from '@mui/material';

import styles from './page.module.css';
import About from '../components/About';
import CardContainer from '../components/CardContainer';
import { APPLICATION_NAME } from '../config/constants';

const Home: React.FC = async () => {
  return (
    <>
      <div className={styles.header}>
        <img className={styles.image1} />
        <div className={styles.headercontainer}>
          <h1 className={styles.title}>{APPLICATION_NAME}</h1>
          <h3 className={styles.subheader2}>
            Your favourite recipe app. <br />
            Rate recipes, share your own, and so much more!
          </h3>
          <Button variant="contained" href='/recipes' color="warning">
            Get Started
          </Button>
        </div>
      </div>

      <div className={styles.cardcontainer}>
        <CardContainer />
        <CardContainer />
        <CardContainer />
      </div>

      <About />
    </>
  );
};

export default Home;