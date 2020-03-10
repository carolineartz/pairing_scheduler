import * as React from 'react'

import { Grommet, Box } from 'grommet'
import { ThemeType } from 'grommet/themes/base'
import { deepFreeze } from 'grommet/utils'
import { CreateProjectForm } from "./components/CreateProjectForm"

import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file

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
    <CreateProjectForm />
  </Grommet>
)

export default App
