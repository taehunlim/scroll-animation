import React from 'react';
import bezierEasing from 'bezier-easing';

import ScrollAnimation from 'components/ScrollAnimation';

const ease = bezierEasing(0.25, 0.1, 0.25, 1.0);
const easeIn = bezierEasing(0.38, 0.01, 0.78, 0.13);

const animation = [
   {
      start: 4.5,
      end: 5.3,
      easing: ease,
      styles: {
         translateY: [200, 0],
         opacity: [0, 1],
      },
   },
   {
      start: 5.3,
      end: 5.9,
      easing: easeIn,
      styles: {
         opacity: [1, 0],
      },
   },
];

const Home = () => {
   const { Slide } = ScrollAnimation;
   return (
      <div>
         <ScrollAnimation>
            <Slide className="scdown">아래로 스크롤하세요.</Slide>
            <Slide>
               <p>안녕하세요.</p>
            </Slide>
            <Slide>
               <p>반갑습니다.</p>
            </Slide>
            <Slide>
               <p>세번째</p>
               <p>슬라이드 입니다.</p>
            </Slide>
            <Slide>
               <p>네번째</p>
               <p>슬라이드 입니다.</p>
            </Slide>
            <Slide>
               <p>마지막</p>
               <p>슬라이드 입니다.</p>
            </Slide>
            <Slide animation={animation}>따로 노는 배경</Slide>
         </ScrollAnimation>
      </div>
   );
};

export default Home;
