import React, {
   useRef,
   useEffect,
   useState,
   ReactNode,
   ReactElement,
} from 'react';
import { useEffectOnce } from '../useEffectOnce';
import { defaultAnimation } from './defaultAnimation';
import { AnimationProps, StylesProps } from './model';

import styledComponent from './style';

interface Props {
   children: ReactNode;
}

type ElementProps = HTMLDivElement & {
   style: {
      [key: string]: string | number;
   };
};

interface AnimationsProps extends AnimationProps {
   animation: AnimationProps[];
}

const { Container, Sticky, SlideContainer, StyledSlide } = styledComponent;

const viewHeight = window.innerHeight;

const ScrollAnimation = ({ children }: Props) => {
   const ref = useRef<HTMLDivElement>(null);
   const slideContainerRef = useRef<HTMLDivElement>(null);
   const slidePositionRef = useRef({
      start: 0,
      end: 0,
   });

   const [isRendered, setIsRendered] = useState(false);

   const enabled = new Map();
   const disabled = new Map();

   function isAmong(num: number, start: number, end: number) {
      return num >= start && num <= end;
   }

   function applyStyle(
      element: ElementProps,
      styleName: string,
      value: number,
   ) {
      if (styleName === 'translateY') {
         element.style.transform = `translateY(${value}%)`;
         return;
      }
      if (styleName === 'translateX') {
         element.style.transform = `translateX(${value}%)`;
         return;
      }
      return (element.style[styleName] = value);
   }

   function onScroll(slides: HTMLCollectionOf<ElementProps>) {
      // 현재 스크롤 위치 파악
      const scrollTop = window.scrollY || window.pageYOffset;
      const currentCenterPosition = scrollTop + viewHeight / 2;

      // disabled 순회하며 활성화할 요소 찾기.
      disabled.forEach((obj, slideIndex) => {
         const { start, end } = obj;

         // 만약 칸에 있다면 해당 요소 활성화
         if (isAmong(currentCenterPosition, start, end)) {
            enabled.set(slideIndex, obj);
            slides[slideIndex].classList.add('enabled');
            disabled.delete(slideIndex);
         }
      });

      // enabled 순회하면서 헤제할 요소를 체크
      enabled.forEach((obj, slideIndex) => {
         const { start, end } = obj;

         // 범위 밖에 있다면
         if (!isAmong(currentCenterPosition, start, end)) {
            // 리스트에서 삭제하고 disabled로 옮김.
            disabled.set(slideIndex, obj);

            slides[slideIndex].classList.remove('enabled');
            enabled.delete(slideIndex);
         }

         // enable 순회중, 범위 내부에 제대로 있다면 각 애니메이션 적용시키기.
         else {
            applyAllAnimation(slides[slideIndex], obj, currentCenterPosition);
         }
      });
   }

   function applyAllAnimation(
      target: ElementProps,
      animations: AnimationsProps,
      currentCenterPosition: number,
   ) {
      if (!animations) return;

      animations.animation.map((animation) => {
         const { start: a_start, end: a_end, easing, styles } = animation;
         const isIn = isAmong(currentCenterPosition, a_start, a_end);
         // 만약 애니메이션이 새롭게 들어갈 때 혹은 나갈때 enabled 설정
         if (isIn) {
            if (!animation.enabled) animation.enabled = true;
         }

         if (!isIn && animation.enabled) {
            if (currentCenterPosition <= a_start) {
               applyStyles(target, styles, 0);
            }

            if (currentCenterPosition >= a_end) {
               applyStyles(target, styles, 1);
            }
            animation.enabled = false;
         }

         // 애니메이션이 enabled 라면, 애니메이션 적용.
         if (animation.enabled) {
            const keyframe = easing(
               (currentCenterPosition - a_start) / (a_end - a_start),
            );
            applyStyles(target, styles, keyframe);
         }
      });
   }

   function applyStyles(
      target: ElementProps,
      styles: StylesProps,
      keyframe: number,
   ) {
      Object.keys(styles).map((style) => {
         console.log(styles, style);

         if (styles[style]) {
            const [startValue, endValue] = styles[style];

            const calc = (endValue - startValue) * keyframe + startValue;

            applyStyle(target, style, calc);
         }
      });
   }

   useEffectOnce(() => {
      if (slideContainerRef.current) {
         setIsRendered(true);
      }
   });

   useEffect(() => {
      if (isRendered) {
         const target = ref.current;
         const slideContainer = slideContainerRef.current;

         const slides =
            slideContainer?.children as HTMLCollectionOf<ElementProps>;

         if (slides) {
            const slidesLength = slides.length;
            if (target) {
               target.style.height = `${viewHeight * (slidesLength + 1)}px`;
            }

            for (const index of Array.from(slides).keys()) {
               const animation = (
                  React.Children.toArray(children)[index] as ReactElement
               ).props.animation;

               const animationWithHeightSet = animation?.map(
                  (a: AnimationProps) => {
                     const start = a.start * viewHeight;
                     const end = a.end * viewHeight;
                     return {
                        ...a,
                        start,
                        end,
                     };
                  },
               );

               animationWithHeightSet?.reduce(
                  (prev: AnimationProps, current: AnimationProps) => {
                     if (prev.start < current.start)
                        slidePositionRef.current.start =
                           prev.start < current.start
                              ? prev.start
                              : current.start;

                     const prevStart = prev.start;
                     const prevEnd = prev.end;

                     const currentStart = current.start;
                     const currentEnd = current.end;

                     slidePositionRef.current.start =
                        prevStart < currentStart ? prevStart : currentStart;
                     slidePositionRef.current.end =
                        prevStart > currentStart ? prevEnd : currentEnd;

                     return prev.start > current.start ? prev : current;
                  },
               );

               const defaultStart = viewHeight * index;
               const defaultEnd = viewHeight * (index + 1);

               const customAnimation = animationWithHeightSet && {
                  start: slidePositionRef.current.start,
                  end: slidePositionRef.current.end,
                  animation: animationWithHeightSet,
               };

               const currentAnimation =
                  customAnimation || defaultAnimation(defaultStart, defaultEnd);

               if (index === 0) {
                  enabled.set(index, currentAnimation);
                  slides[index].classList.add('enabled');
               }
               disabled.set(index, currentAnimation);
            }

            document.addEventListener('scroll', () => onScroll(slides));

            return () => {
               document.removeEventListener('scroll', () => onScroll(slides));
            };
         }
      }
   }, [isRendered]);

   return (
      <Container ref={ref}>
         <Sticky>
            <SlideContainer ref={slideContainerRef}>{children}</SlideContainer>
         </Sticky>
      </Container>
   );
};

ScrollAnimation.Slide = StyledSlide;

export default ScrollAnimation;
