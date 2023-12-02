import { Button } from '@mui/material';
import Image from 'next/image';

import styles from './page.module.css';
import About from '../components/About';
import PricingCard from '../components/PricingCard';
import { APPLICATION_NAME } from '../lib/constants';

const Home: React.FC = async () => {
  return (
    <>
      <div className={styles.header}>
        <Image
          className={styles.backgroundimage}
          src={'https://media0.giphy.com/media/oESgZ6uNs9xgQulYiK/giphy.gif?cid=ecf05e47742cvfn7a83uu4w877ct7kpil70pcxwh7qzuqfkf&ep=v1_gifs_search&rid=giphy.gif&ct=g'}
          alt="food"
          quality={10}
          layout="fill"
        />
        <div className={styles.headercontainer}>
          <h1 className={styles.title}>{APPLICATION_NAME}</h1>
          <h3 className={styles.subheader2}>
            Your favourite recipe app. <br />
            Rate recipes, share your own, and so much more!
          </h3>
          <Button variant="contained" href='/recipes' color="primary">
            Get Started
          </Button>
        </div>
      </div>

      <div className={styles.cardcontainer}>
        <PricingCard
          title="Personal"
          description="Some random description"
        />
        <PricingCard
          title="Professional"
          price={10}
          description="Some random description"
        />
        <PricingCard
          title="Enterprise"
          price={1337}
          description="Some random description"
        />
      </div>

      <About />
    </>
  );
};

export default Home;