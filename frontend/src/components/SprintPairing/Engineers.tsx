import * as React from 'react'
import { random } from 'lodash'

import { Box, Image } from 'grommet'

type WorkContext = 'solo' | 'pair'

export const getRandomPearPath = (): string => `/pear-${random(1, 6)}.svg`

export const Engineers = ({
  context,
  children,
}: {
  context: WorkContext
  children: React.ReactNode
}) => (
  <Box direction="row" pad="small" height={{ max: 'medium' }}>
    <Box justify="center">
      <Image
        width="50px"
        src={context === 'solo' ? 'apple.svg' : getRandomPearPath()}
        fit="contain"
      />
    </Box>
    <Box pad={{ horizontal: 'small' }} gap="xsmall" justify="center">
      {children}
    </Box>
  </Box>
)
