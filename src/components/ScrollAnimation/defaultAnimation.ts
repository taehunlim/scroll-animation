import bezierEasing from 'bezier-easing';

const ease = bezierEasing(0.25, 0.1, 0.25, 1.0);
const easeIn = bezierEasing(0.38, 0.01, 0.78, 0.13);
const midSlow = bezierEasing(0, 0.7, 1, 0.3);

export function defaultAnimation(start: number, end: number) {
   return {
      start,
      end,
      animation: [
         {
            start: start,
            end: end,
            easing: midSlow,
            styles: {
               translateY: [60, -60],
            },
         },
         {
            start: start,
            end: (end + start) / 2,
            easing: ease,
            styles: {
               opacity: [0, 1],
            },
         },
         {
            start: (end + start) / 2,
            end: end,
            easing: easeIn,
            styles: {
               opacity: [1, 0],
            },
         },
      ],
   };
}
