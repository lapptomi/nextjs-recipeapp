import { People } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import Image from 'next/image';

import styles from './page.module.css';
import ImageSlider from '../components/ImageSlider';
import PricingCard from '../components/PricingCard';
import { APPLICATION_NAME } from '../lib/constants';

const Home = () => {
  const IMAGES = [
    'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    'https://images.immediate.co.uk/production/volatile/sites/2/2016/04/Sri-Lankan-Vegetarian-Curry-Recipe-d485816.jpg?quality=90&crop=11px,225px,5024px,4563px&resize=556,505'
  ];

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

      <div className={styles.aboutcontainer}>
        <ImageSlider items={IMAGES} />
        <div className={styles.abouttext}>
          <Typography variant="h3" fontWeight="bold">ABOUT</Typography>
          <Typography variant="body1" color="text.secondary">
            Lorem ipsum dolor sit amet. 
            Ad porro necessitatibus ut internos nihil et consequatur aliquid id dolor rerum ad quasiearum eum velit quis aut velit deleniti.
            Ut laborum iusto est quisquam minus vel illo officia sit voluptatum dolorum id voluptas officia?
            Et quasi modi At Quis sunt est consequuntur illo.
            Lorem ipsum dolor sit amet. 
            Ad porro necessitatibus ut internos nihil et consequatur aliquid id dolor rerum ad quasiearum eum velit quis aut velit deleniti.
            Ut laborum iusto est quisquam minus vel illo officia sit voluptatum dolorum id voluptas officia?
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
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          
        }}>
          <Typography style={{ padding: 20 }} color="white" variant="h4" fontWeight="bold">
            {'Sign Up Today For Free!'.toUpperCase()}
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