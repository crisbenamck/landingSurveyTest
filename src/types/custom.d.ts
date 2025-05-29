declare module '*.svg' {
  const content: any;
  export default content;
}

interface Window {
  interviewTimer: ReturnType<typeof setInterval> | undefined;
}