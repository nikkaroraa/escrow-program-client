const baseStyles = {
  lineHeight: 'inherit',
  fontSize: 'inherit',
  outline: 'unset',
  minHeight: 0,
  minWidth: 0,
  _focus: {
    boxShadow: 'none',
  },
}

const Button = {
  variants: {
    simple: {
      ...baseStyles,
      bg: 'none',
      color: 'inherit',
      display: 'inline',
    },
    primary: {
      ...baseStyles,
      background: '#333',
      color: '#eee',
      borderRadius: '10px',
      opacity: '0.9',
      _hover: {
        opacity: 1,
        _disabled: {
          background: '#333',
          opacity: 0.5,
        },
      },
      _focus: {
        opacity: 1,
        boxShadow: 'none',
      },
      _active: { opacity: 1 },
      _disabled: { opacity: 0.5 },
      textAlign: 'center',
    },
    secondary: {
      ...baseStyles,
      color: '#333',
      fontWeight: 'medium',
      px: 0,
      opacity: '0.9',
      _hover: {
        opacity: 1,
        _disabled: {
          opacity: 0.5,
        },
      },
      _focus: {
        opacity: 1,
        boxShadow: 'none',
      },
      _active: { opacity: 1 },
      _disabled: { opacity: 0.5 },
      textAlign: 'center',
    },
    grayscale: {
      ...baseStyles,
      border: '1px',
      color: '#777',
      borderColor: '#dddddd',
      backgroundColor: '#f6f6f6',
      _hover: {
        backgroundColor: '#e9e9e9',
        _disabled: {
          backgroundColor: '#f6f6f6',
        },
      },
      _disabled: {
        opacity: 0.6,
      },
    },
  },
}

export default Button
