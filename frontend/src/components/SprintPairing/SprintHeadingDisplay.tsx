import * as React from 'react'
import { format as formatDate } from 'date-fns/esm'

import { Box, Text, Button } from 'grommet'
import { FormNext, FormPrevious } from 'grommet-icons'
import {
  SequentialDirection,
  getNextSequentialSprint,
  indexOfSprint,
} from '../../projectDateCalculations'
import styled from 'styled-components'

type SprintHeadingDisplayProps = {
  setSelectedSprint: any
  selectedSprint: any
  project: Project
}

export const CalendarHeadingDisplay = ({
  setSelectedSprint,
  selectedSprint,
  project,
}: SprintHeadingDisplayProps) => {
  const onClick = (direction: SequentialDirection) =>
    setSelectedSprint(getNextSequentialSprint(project, selectedSprint, direction))

  const formatSprintNumber = (number: number) => number.toString().padStart(2)

  return (
    <Box margin={{ bottom: 'large' }}>
      <Box align="center" justify="center" direction="row" pad={{ bottom: 'xsmall' }}>
        <Button icon={<FormPrevious />} onClick={() => onClick('backwards')} />
        <SprintHeadingText weight={700}>
          Sprint&nbsp;
          {`${formatSprintNumber(indexOfSprint(project, selectedSprint))}`}
        </SprintHeadingText>
        <Button icon={<FormNext />} onClick={() => onClick('forwards')} />
      </Box>
      <Box align="center">
        <SprintDates sprint={selectedSprint} />
      </Box>
    </Box>
  )
}

const SprintDates = ({ sprint }: { sprint: Sprint }) => (
  <SprintHeadingText size="small">{`${formatDate(sprint.startDate, 'MM/dd/yyyy')} - ${formatDate(
    sprint.endDate,
    'MM/dd/yyyy'
  )}`}</SprintHeadingText>
)

const SprintHeadingText = styled(Text)`
  font-family: Source Code Pro;
`
