import { ThemeType } from 'grommet/themes/base'
import { deepFreeze } from 'grommet/utils'

// Grommet theme customizations
// Automatically merges in with the grommet default theme when passed in as a prop.
// https://github.com/grommet/grommet/wiki/Grommet-v2-theming-documentation
export const theme: ThemeType = deepFreeze({
  global: {
    colors: {
      brand: '#81357D',
      'accent-1': '#bd53b8',
      'accent-2': '#500d4d',
      focus: '#bd53b8',
    },
    breakpoints: {
      small: {
        value: 700,
      },
      medium: {
        value: 1200,
      },
    },
    font: {
      family: 'Montserrat',
      size: '16px',
    },
  },
  formField: {
    label: {
      weight: 'bold',
    },
  },
  tab: {
    pad: 'small',
    margin: 'none',
    border: {
      active: {
        color: 'brand',
      },
      hover: {
        color: 'brand',
      },
    },
    active: {
      background: 'brand',
      color: 'white',
    },
    hover: {
      background: 'accent-1',
      color: 'white',
    },
  },
})
