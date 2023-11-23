"use client";

import { useLayoutEffect, useState } from 'react';

import { animated, useSpringRef, useTransition } from '@react-spring/web';

import styles from '@/styles/About.module.css';

const IMAGES = [
  'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
  'https://images.immediate.co.uk/production/volatile/sites/2/2016/04/Sri-Lankan-Vegetarian-Curry-Recipe-d485816.jpg?quality=90&crop=11px,225px,5024px,4563px&resize=556,505'
];

const About = () => {
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
        setActiveIndex(activeIndex === IMAGES.length - 1 ? 0 : activeIndex + 1);
      }
    },
    exitBeforeEnter: true,
    config: {
      duration: 1000,
    },
    delay: 1000,
    ref: springApi,
  });


  useLayoutEffect(() => {
    springApi.start();
  }, [activeIndex, springApi]);

  return (
    <div className={styles.container}>
      {transitions((springs: any, item: any) => (
        <animated.div style={springs}>
          <img className={styles.imagecontainer} src={IMAGES[item]} />
        </animated.div>
      ))}
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

export default About;
