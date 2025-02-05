declare module '*?raw' {
  const content: string;
  export default content;
}

declare module '@client/*.css?raw' {
  const content: string;
  export default content;
}

declare module '@client/*.js?raw' {
  const content: string;
  export default content;
}
