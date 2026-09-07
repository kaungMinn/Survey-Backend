// input.d.ts
declare module 'input' {
  export function text(prompt: string): Promise<string>;
  export function password(prompt: string): Promise<string>;
  export function confirm(prompt: string): Promise<boolean>;
  export function number(prompt: string): Promise<number>;
  const _default: {
    text: typeof text;
    password: typeof password;
    confirm: typeof confirm;
    number: typeof number;
  };
  export default _default;
}