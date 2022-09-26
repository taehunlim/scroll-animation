import { EasingFunction } from 'bezier-easing';

export interface AnimationProps {
   start: number;
   end: number;
   easing: EasingFunction;
   styles: StylesProps;
   enabled?: boolean;
}

interface StringKey {
   [key: string]: number[] | undefined;
}

export type StylesProps = StringKey & {
   [Key in keyof CSSStyleDeclaration]?: number[];
};
