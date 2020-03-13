import * as React from 'react'
import { random } from 'lodash'

import { Box, Image } from 'grommet'

type WorkContext = 'solo' | 'pair'

export const getRandomPearPath = (): string => `/pear-${random(1, 6)}.svg`

type EngineersProps = {
  context: WorkContext
  imageWidth?: React.ImgHTMLAttributes<HTMLImageElement>['width']
  imageHeight?: React.ImgHTMLAttributes<HTMLImageElement>['height']
  children: React.ReactNode
}

export const Engineers = ({
  context,
  imageHeight = '50px',
  imageWidth = '50px',
  children,
}: EngineersProps) => (
  <Box direction="row" pad="small" height={{ max: 'medium' }}>
    <Box justify="center">
      <Image
        width={imageWidth}
        height={imageHeight}
        src={context === 'solo' ? 'apple.svg' : getRandomPearPath()}
        fit="contain"
      />
    </Box>
    <Box pad={{ horizontal: 'small' }} gap="xsmall" justify="center">
      {children}
    </Box>
  </Box>
)
