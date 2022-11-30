import { EasingFunction } from 'bezier-easing';

export interface AnimationProps {
   start: number;
   end: number;
   easing: EasingFunction;
   styles: StylesProps;
   enabled?: boolean;
}

type ExceptStyleDeclaration =
   | 'readonly parentRule'
   | 'setProperty'
   | 'getPropertyPriority'
   | 'getPropertyValue'
   | 'item'
   | 'removeProperty';

export type CSSStyleRule = Omit<CSSStyleDeclaration, ExceptStyleDeclaration> & {
   [index: string]: string;

   translateY: string;
   translateX: string;
};

export type StylesProps = {
   [Key in keyof CSSStyleRule]?: number[];
};
