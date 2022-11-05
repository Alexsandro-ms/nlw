/* Um arquivo de declaração para TypeScript. Está dizendo ao TypeScript que o arquivo é um módulo e que é
um componente React. */
declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}
