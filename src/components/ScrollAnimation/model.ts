export interface AnimationProps {
   start: number;
   end: number;
   easing: any;
   styles: StylesProps;
   enabled?: boolean;
}

interface StringKey {
   [key: string]: any;
}

export type StylesProps = StringKey & {
   [Key in keyof CSSStyleDeclaration]?: number[];
};
