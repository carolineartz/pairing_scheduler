/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react'
import styled from 'styled-components'

import { Calendar as RDRCalendar } from 'react-date-range'
import {
  Box,
  Stack,
  Diagram,
  Text,
  Image,
  ResponsiveContext,
  DiagramConnectionAnchor,
  DiagramConnectionType,
} from 'grommet'
import { random } from 'lodash'

import { CalendarHeadingDisplay } from './SprintHeadingDisplay'

import {
  SingleDateRangeObject,
  getSprintForDate,
  getCurrentSprint,
  getFirstSprint,
  calculateDateRange,
  getInvalidDates,
} from '../../projectDateCalculations'
import { Engineers } from './Engineers'

type ProjectInfoProps = {
  project: Project
}

const anchor: DiagramConnectionAnchor = 'vertical'
const type: DiagramConnectionType = 'curved'

const markerIdForSprintId = (sprintId: number) => `diagram-marker-${sprintId.toString()}`

const connection = (fromSprintId: number, toSprintId: number): any => ({
  fromTarget: markerIdForSprintId(fromSprintId),
  toTarget: markerIdForSprintId(toSprintId),
  thickness: 'xxsmall',
  color: 'brand',
  round: true,
  id: `${fromSprintId.toString()}-${toSprintId.toString()}`,
  type,
  anchor,
})

const ConnectionsColumn = styled(Box)``
const PairsColumn = styled(Box)``
const Wrapper = styled(Box)``

export const Timeline = (props: ProjectInfoProps) => {
  props.project.sprints.sort(
    (a: Sprint, b: Sprint) => b.startDate.getTime() - a.startDate.getTime()
  )
  const [_lastSprint, ...sprintsWithConnections] = props.project.sprints.reverse()

  const connections = sprintsWithConnections.map((sprint: Sprint, index: number) =>
    connection(props.project.sprints[index].id, props.project.sprints[index + 1].id)
  )

  const currentSprint = getCurrentSprint(props.project)
  console.log(currentSprint)

  return (
    <Stack guidingChild={1}>
      <Diagram key={`project-stack-diagram-${props.project.id}`} connections={connections} />
      <Box key={`project-stack-content-${props.project.id}`}>
        {props.project.sprints.map((sprint: Sprint) => (
          <Wrapper direction="row" gap="medium" align="center" key={`sprint-pairings-${sprint.id}`}>
            <ConnectionsColumn>
              <Box
                width="30px"
                height="30px"
                id={markerIdForSprintId(sprint.id)}
                round="50%"
                background={
                  currentSprint && sprint.id === currentSprint.id ? 'accent-2' : 'accent-1'
                }
              ></Box>
            </ConnectionsColumn>
            <PairsColumn justify="center">
              <Box pad="small" direction="row" border="bottom" wrap>
                {sprint.pairs.map(([eng1, eng2]: [Engineer, Engineer]) => (
                  <Engineers
                    imageWidth="20px"
                    imageHeight="20px"
                    key={`${eng1.name}-${eng2.name}`}
                    context={'pair'}
                  >
                    <Text
                      weight={currentSprint && sprint.id === currentSprint.id ? 'bold' : 'normal'}
                    >
                      {eng1.name}
                    </Text>
                    <Text
                      weight={currentSprint && sprint.id === currentSprint.id ? 'bold' : 'normal'}
                    >
                      {eng2.name}
                    </Text>
                  </Engineers>
                ))}
                {sprint.soloEngineer && (
                  <Engineers imageWidth="20px" imageHeight="20px" context={'solo'}>
                    <Text
                      weight={currentSprint && sprint.id === currentSprint.id ? 'bold' : 'normal'}
                    >
                      {sprint.soloEngineer.name}
                    </Text>
                  </Engineers>
                )}
              </Box>
            </PairsColumn>
          </Wrapper>
        ))}
      </Box>
    </Stack>
  )
}
