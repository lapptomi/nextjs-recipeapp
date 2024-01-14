import { FastfoodOutlined, People } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import Image from 'next/image';

import PricingCard from '@/components/PricingCard';
import { APPLICATION_NAME } from '@/lib/constants';

import styles from './page.module.css';
import foodgif from '../../public/food-gif.webp';

const Home = () => {
  return (
    <>
      <div className={styles.header}>
        <Image
          className={styles.backgroundimage}
          src={foodgif}
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

      <div className={styles.aboutcontainer}>
        <FastfoodOutlined style={{ height: 400,  width: 400, color: '#444444' }} />
        <div className={styles.abouttext}>
          <Typography variant="h2" fontWeight="bold">ABOUT</Typography>
          <Typography variant="body1" color="text.secondary">
            Lorem ipsum dolor sit amet. 
            Ad porro necessitatibus ut internos nihil et consequatur aliquid id dolor rerum
            ad quasiearum eum velit quis aut velit deleniti.
            Ut laborum iusto est quisquam minus vel illo officia sit voluptatum dolorum id voluptas officia?
            Et quasi modi At Quis sunt est consequuntur illo. Lorem ipsum dolor sit amet. 
            Ad porro necessitatibus ut internos nihil et consequatur aliquid id dolor rerum ad 
            quasiearum eum velit quis aut velit deleniti. Ut laborum iusto est quisquam minus
            vel illo officia sit voluptatum dolorum id voluptas officia?
            Et quasi modi At Quis sunt est consequuntur illo.
          </Typography>
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

      <div className={styles.joincontainer}>
        <div className={styles.join}>
          <Typography style={{ padding: 20 }} color="white" variant="h4" fontWeight="bold">
            SIGN UP TODAY FOR FREE!
          </Typography>

          <Button variant="outlined" href='/auth/register' color="info">
            Create free account
          </Button>
        </div>
        <People color="disabled" className={styles.joinsvg} />
      </div>
    </>
  );
};

export default Home;
