import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "#121212" : "#F8F9FA", // Deep Charcoal for dark mode, Soft Ivory for light mode
        color: props.colorMode === "dark" ? "#E0E0E0" : "#1A1A1A",
        transition: "background-color 0.4s ease-in-out",
      },
    }),
  },

  colors: {
    primary: {
      50: "#EAF2FE",
      100: "#C7D8FB",
      200: "#A4BEF9",
      300: "#809FF6",
      400: "#5C7DF3", // 🔵 **Royal Blue**
      500: "#3A5CDB", // 💎 **Deep Sapphire**
      600: "#2F4BB8",
      700: "#233795",
      800: "#182572",
      900: "#0E154F",
    },
    secondary: {
      50: "#FAEAEF",
      100: "#EFC7D1",
      200: "#E4A4B2",
      300: "#D97F92",
      400: "#CC5A72", // ❤️ **Deep Rosewood**
      500: "#B33E56", // 🍷 **Burgundy Wine**
      600: "#902D42",
      700: "#6E1E2E",
      800: "#4C0F1B",
      900: "#2A0309",
    },
    accent: {
      50: "#FBF4E0",
      100: "#F5E0B3",
      200: "#EFCB84",
      300: "#E9B756",
      400: "#E3A332", // ✨ **Champagne Gold**
      500: "#CC8A00", // 🌟 **Elegant Gold**
      600: "#A07000",
      700: "#745000",
      800: "#493000",
      900: "#1F1000",
    },
    background: {
      dark: "#121212", // **Deep Charcoal**
      light: "#F8F9FA", // **Soft Ivory**
    },
    text: {
      light: "#1A1A1A",
      dark: "#E0E0E0",
    },
  },

  components: {
    Link: {
      baseStyle: {
        color: "primary.400",
        _hover: {
          textDecoration: "none",
          color: "primary.500",
        },
      },
    },
    Modal: {
      baseStyle: (props) => ({
        dialog: {
          bg: props.colorMode === "dark" ? "background.dark" : "background.light",
          color: props.colorMode === "dark" ? "text.dark" : "text.light",
          boxShadow: "xl",
          borderRadius: "md",
        },
      }),
    },
    Drawer: {
      baseStyle: (props) => ({
        dialog: {
          bg: props.colorMode === "dark" ? "background.dark" : "background.light",
          color: props.colorMode === "dark" ? "text.dark" : "text.light",
        },
      }),
    },
    Button: {
      baseStyle: {
        fontWeight: "bold",
        borderRadius: "md",
      },
      variants: {
        solid: {
          bg: "primary.500", // **Deep Sapphire**
          color: "white",
          _hover: {
            bg: "primary.600",
          },
        },
        outline: {
          borderColor: "accent.500",
          color: "accent.500",
          _hover: {
            bg: "accent.100",
          },
        },
        ghost: {
          color: "secondary.500",
          _hover: {
            bg: "secondary.100",
          },
        },
      },
    },
  },
});

export default theme;
