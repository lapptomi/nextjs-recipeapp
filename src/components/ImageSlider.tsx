"use client";

import { useLayoutEffect, useState } from 'react';

import { animated, useSpringRef, useTransition } from '@react-spring/web';
import Image from 'next/image';

import styles from '@/styles/ImageSlider.module.css';

interface Props {
  items: any[];
}

const ImageSlider = ({ items }: Props) => {
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
        setActiveIndex(activeIndex === items.length - 1 ? 0 : activeIndex + 1);
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
    <div>
      {transitions((springs: any, item: any) => (
        <animated.div style={springs}>
          <Image
            alt="food"
            width={400}
            height={400}
            className={styles.imagecontainer}
            src={items[item]}
          />
        </animated.div>
      ))}
    </div>
  );
};

export default ImageSlider;
