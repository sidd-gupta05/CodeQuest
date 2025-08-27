import 'next/navigation';

declare module 'next/navigation' {
  export interface AppRouterInstance {
    push(
      href:
        | string
        | {
            pathname: string;
            query?: { [key: string]: string | number };
          }
    ): void;
  }
}
