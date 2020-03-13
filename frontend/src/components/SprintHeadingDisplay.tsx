import * as React from 'react'
import { format as formatDate } from 'date-fns/esm'

import { Box, Text, Button } from 'grommet'
import { FormNext, FormPrevious } from 'grommet-icons'
import { SequentialDirection, getNextScrollingSprint } from './../projectDateCalculations'

type SprintHeadingDisplayProps = {
  setSelectedSprint: any
  selectedSprint: any
  project: Project
}

export const SprintHeadingDisplay = (props: SprintHeadingDisplayProps) => {
  const onClick = (direction: SequentialDirection) =>
    props.setSelectedSprint(getNextScrollingSprint(props.project, props.selectedSprint, direction))

  return (
    <Box direction="row" margin={{ bottom: 'large' }} pad={{ bottom: 'xsmall' }} border="bottom">
      <Button icon={<FormPrevious />} onClick={() => onClick('backwards')} />
      <SprintHeading sprint={props.selectedSprint} />
      <Button icon={<FormNext />} onClick={() => onClick('forwards')} />
    </Box>
  )
}

const SprintHeading = ({ sprint }: { sprint: Sprint }) => (
  <Text weight="bold" size="large">{`Sprint ${formatDate(
    sprint.startDate,
    'M/d/yyyy'
  )} - ${formatDate(sprint.endDate, 'M/d/yyyy')}`}</Text>
)
