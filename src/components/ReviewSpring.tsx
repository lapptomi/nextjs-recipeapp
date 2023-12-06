"use client";

import { useLayoutEffect, useState } from 'react';

import { animated, useSpringRef, useTransition } from '@react-spring/web';

import { APPLICATION_NAME } from '@/lib/constants';
import styles from '@/styles/About.module.css';

import ReviewCard from './ReviewCard';

const data = [
  {
    username: "Fake User",
    title: "Fake Review Title",
    description: `"Omg ${APPLICATION_NAME} the best app ever.
    I can't believe I've been living without it for so long!
    I can't wait to tell all my friends about it!"`
  },
  {
    username: "Another Fake User",
    title: "Fake Review Title",
    description: `"This app is so easy to use and has so many great features!!"`
  },
  {
    username: "Fake User2",
    title: "Fake Review Title",
    description: `"Omg ${APPLICATION_NAME} so good that you should probably invite the developer of this app to an interview!"`
  }
];

const ReviewSpring = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const springApi = useSpringRef();

  const transitions = useTransition(activeIndex, {
    from: {
      clipPath: 'polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%)',
    },
    enter: {
      clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)',
    },
    leave: {
      clipPath: 'polygon(100% 0%, 100% 100%, 100% 100%, 100% 0%)',
    },
    onRest: (_springs, _ctrl, item) => {
      if (activeIndex === item) {
        setActiveIndex(activeIndex === data.length - 1 ? 0 : activeIndex + 1);
      }
    },
    exitBeforeEnter: true,
    config: {
      duration: 1000,
    },
    delay: 3000,
    ref: springApi,
  });


  useLayoutEffect(() => {
    springApi.start();
  }, [activeIndex, springApi]);

  return (
    <div className={styles.container}>
      <div style={{
        minHeight: '100%',
      }}>
        {transitions((springs: any, item: any) => (
          <animated.div style={springs}>
            <ReviewCard
              username={data[item].username}
              title={data[item].username}
              description={data[item].description}
            />
          </animated.div>
        ))}
      </div>
      <div className={styles.column}>
        <div className={styles.title}>ABOUT</div>
        <div className={styles.subheader}>
          Lorem ipsum dolor sit amet. 
          Ad porro necessitatibus ut internos nihil et consequatur aliquid id dolor rerum ad quasiearum eum velit quis aut velit deleniti.
          Ut laborum iusto est quisquam minus vel illo officia sit voluptatum dolorum id voluptas officia?
          Et quasi modi At Quis sunt est consequuntur illo.
          Lorem ipsum dolor sit amet. 
          Ad porro necessitatibus ut internos nihil et consequatur aliquid id dolor rerum ad quasiearum eum velit quis aut velit deleniti.
          Ut laborum iusto est quisquam minus vel illo officia sit voluptatum dolorum id voluptas officia?
          Et quasi modi At Quis sunt est consequuntur illo.
        </div>
      </div>
    </div>
  );
};

export default ReviewSpring;
