// types/global.d.ts
export {};

declare global {
  interface Window {
    fbq: (
      action: string,
      event: string,
      options?: Record<string, any>
    ) => void;
    _fbq: any;
  }
}