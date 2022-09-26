import { useEffect, useRef } from 'react';

type EffectProps = void | (() => void);

export const useEffectOnce = (effect: () => EffectProps) => {
   const destroyFunction = useRef<EffectProps>();
   const isCalledOnce = useRef(false);
   const isRendered = useRef(false);

   if (isCalledOnce.current) {
      isRendered.current = true;
   }

   useEffect(() => {
      if (isCalledOnce.current) {
         return;
      }

      isCalledOnce.current = true;
      destroyFunction.current = effect();

      return () => {
         if (!isRendered.current) {
            return;
         }

         if (destroyFunction.current) {
            destroyFunction.current();
         }
      };
   }, []);
};
