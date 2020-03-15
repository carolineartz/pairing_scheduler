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
  TextProps,
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
  getNextSprint,
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

  // const currentSprint = getCurrentSprint(props.project)
  const highlightedSprint = getCurrentSprint(props.project) || getNextSprint(props.project)
  // debugger

  const [hoveredName, setHoveredName]: [
    undefined | string,
    React.Dispatch<React.SetStateAction<string | undefined>>
  ] = React.useState()

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
                  highlightedSprint && sprint.id === highlightedSprint.id ? 'accent-2' : 'accent-1'
                }
              ></Box>
            </ConnectionsColumn>
            <PairsColumn justify="center">
              <Box pad="small" direction="row" border="bottom" wrap>
                {sprint.pairs.map(([eng1, eng2]: [Engineer, Engineer], index: number) => (
                  <Engineers
                    imageWidth="20px"
                    imageHeight="20px"
                    key={`${eng1.name}-${eng2.name}`}
                    index={index}
                  >
                    <CustomText
                      hoveredName={hoveredName}
                      name={eng1.name}
                      color={eng1.name === hoveredName ? 'accent-2' : 'dark-1'}
                      weight={
                        highlightedSprint && highlightedSprint.id === sprint.id ? 'bold' : 'normal'
                      }
                      onMouseEnter={() => setHoveredName(eng1.name)}
                      onMouseLeave={() => setHoveredName(undefined)}
                    >
                      <span>{eng1.name}</span>
                    </CustomText>
                    <CustomText
                      hoveredName={hoveredName}
                      name={eng2.name}
                      color={eng2.name === hoveredName ? 'accent-2' : 'dark-1'}
                      weight={
                        highlightedSprint && highlightedSprint.id === sprint.id ? 'bold' : 'normal'
                      }
                      onMouseEnter={() => setHoveredName(eng2.name)}
                      onMouseLeave={() => setHoveredName(undefined)}
                    >
                      <span>{eng2.name}</span>
                    </CustomText>
                  </Engineers>
                ))}
                {sprint.soloEngineer && (
                  <Engineers imageWidth="20px" imageHeight="20px">
                    <CustomText
                      hoveredName={hoveredName}
                      name={sprint.soloEngineer.name}
                      color={sprint.soloEngineer.name === hoveredName ? 'accent-2' : 'dark-1'}
                      weight={
                        highlightedSprint && highlightedSprint.id === sprint.id ? 'bold' : 'normal'
                      }
                      onMouseEnter={() =>
                        setHoveredName(sprint.soloEngineer && sprint.soloEngineer.name)
                      }
                      onMouseLeave={() => setHoveredName(undefined)}
                    >
                      <span>{sprint.soloEngineer.name}</span>
                    </CustomText>
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

type CustomTextProps = TextProps & {
  hoveredName: undefined | string
  name: string
}

const CustomText = styled(Text)<CustomTextProps>`
  font-family: 'Source Code Pro';

  span {
    line-height: 0.35em;
    border-bottom-color: #f986f3ad;
    display: inline-block;
    border-bottom-style: solid;
    border-bottom-width: ${props => (props.name === props.hoveredName ? '6px' : '0')};
  }
`
