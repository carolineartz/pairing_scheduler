import * as React from 'react'

import { Grommet, Box } from 'grommet'
import { ThemeType } from 'grommet/themes/base'
import { deepFreeze } from 'grommet/utils'

const theme: ThemeType = deepFreeze({
  global: {
    colors: {
      brand: '#81357D',
      'accent-1': '#bd53b8',
      'accent-2': '#500d4d',
      focus: '#bd53b8',
    },
    font: {
      family: 'Montserrat',
      size: '16px',
    },
  },
})

const App = () => (
  <Grommet theme={theme} full={true}>
    <Box>App Placeholder</Box>
  </Grommet>
)

export default App
