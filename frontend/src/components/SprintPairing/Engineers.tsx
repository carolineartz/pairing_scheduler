import * as React from 'react'

import { Box, Image } from 'grommet'

const NUM_PEAR_IMAGES = 6

type EngineersProps = {
  imageWidth?: React.ImgHTMLAttributes<HTMLImageElement>['width']
  imageHeight?: React.ImgHTMLAttributes<HTMLImageElement>['height']
  children: React.ReactNode
  index?: number
}

export const Engineers = ({
  imageHeight = '50px',
  imageWidth = '50px',
  children,
  index,
}: EngineersProps) => {
  let imgSrc

  if (index !== undefined) {
    imgSrc = `pear-${(index + 1) % NUM_PEAR_IMAGES}.svg`
  } else {
    imgSrc = 'apple.svg'
  }

  return (
    <Box direction="row" pad="small" height={{ max: 'medium' }}>
      <Box justify="center">
        <Image width={imageWidth} height={imageHeight} src={imgSrc} fit="contain" />
      </Box>
      <Box pad={{ horizontal: 'small' }} gap="xsmall" justify="center">
        {children}
      </Box>
    </Box>
  )
}
