"use client";

import {
  ColorModeProvider,
  ColorModeProviderProps,
} from "../components/ui/color-mode";
import { system } from "../../theme/index";

import { ChakraProvider } from "@chakra-ui/react";

export function Provider(props) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} forcedTheme="light" />
    </ChakraProvider>
  );
}
