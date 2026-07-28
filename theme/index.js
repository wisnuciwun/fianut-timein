import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    body: {
      bg: "#fffefa",
    },
  },
  theme: {
    tokens: {
      colors: {
        brand: {
          bg: { value: "#fffefa" },
          red: { value: "#E84839" },
        },
        primary: {
          DEFAULT: { value: "{colors.red.500}" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
