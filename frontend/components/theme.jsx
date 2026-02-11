import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  styles: {
    global: (props) => ({
      body: {
        bg: '#FFFFFF',
        color: '#2D2D2D',
        transition: 'background-color 0.4s ease-in-out',
      },
    }),
  },

  colors: {
    primary: {
      50: '#FFF4E6',
      100: '#FFE0B2',
      200: '#FFCC80',
      300: '#FFB74D',
      400: '#FFA726',
      500: '#FF9800',
      600: '#FB8C00',
      700: '#F57C00',
      800: '#EF6C00',
      900: '#E65100',
    },
    secondary: {
      50: '#FFF3E0',
      100: '#FFE0B2',
      200: '#FFCC80',
      300: '#FFB74D',
      400: '#FFA726',
      500: '#FF9800',
      600: '#FB8C00',
      700: '#F57C00',
      800: '#EF6C00',
      900: '#E65100',
    },
    accent: {
      50: '#FBE9E7',
      100: '#FFCCBC',
      200: '#FFAB91',
      300: '#FF8A65',
      400: '#FF7043',
      500: '#FF5722',
      600: '#F4511E',
      700: '#E64A19',
      800: '#D84315',
      900: '#BF360C',
    },
    background: {
      dark: '#FFFFFF',
      light: '#FFFFFF',
    },
    text: {
      light: '#2D2D2D',
      dark: '#2D2D2D',
    },
  },

  components: {
    Link: {
      baseStyle: {
        color: 'primary.400',
        _hover: {
          textDecoration: 'none',
          color: 'primary.500',
        },
      },
    },
    Modal: {
      baseStyle: (props) => ({
        dialog: {
          bg: props.colorMode === 'dark' ? 'background.dark' : 'background.light',
          color: props.colorMode === 'dark' ? 'text.dark' : 'text.light',
          boxShadow: 'xl',
          borderRadius: 'md',
        },
      }),
    },
    Drawer: {
      baseStyle: (props) => ({
        dialog: {
          bg: props.colorMode === 'dark' ? 'background.dark' : 'background.light',
          color: props.colorMode === 'dark' ? 'text.dark' : 'text.light',
        },
      }),
    },
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'primary.500',
          color: 'white',
          _hover: {
            bg: 'primary.600',
          },
        },
        outline: {
          borderColor: 'primary.500',
          _hover: {
            bg: 'primary.600',
          },
        },
        ghost: {
          color: 'secondary.500',
          _hover: {
            bg: 'secondary.100',
          },
        },
      },
    },
  },
});

export default theme;
