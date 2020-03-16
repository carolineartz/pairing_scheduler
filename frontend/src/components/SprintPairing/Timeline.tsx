import * as React from 'react'
import styled from 'styled-components'

import {
  Box,
  Stack,
  Diagram,
  Text,
  DiagramConnectionAnchor,
  DiagramConnectionType,
  TextProps,
  BoxProps,
} from 'grommet'

import { getCurrentSprint, getNextSprint, isPastSprint } from '../../projectDateCalculations'

import { Engineers } from './Engineers'
import { ColorType } from 'grommet/utils'
import { format as formatDate } from 'date-fns/esm'

type ProjectInfoProps = {
  project: Project
}

const anchor: DiagramConnectionAnchor = 'vertical'
const type: DiagramConnectionType = 'curved'

const markerIdForSprintId = (sprintId: number) => `diagram-marker-${sprintId.toString()}`

type SprintTimeCategory = 'past' | 'current' | 'future'

const connection = (fromSprintId: number, toSprintId: number, color: ColorType): any => ({
  fromTarget: markerIdForSprintId(fromSprintId),
  toTarget: markerIdForSprintId(toSprintId),
  thickness: 'xxsmall',
  color,
  round: true,
  id: `${fromSprintId.toString()}-${toSprintId.toString()}`,
  type,
  anchor,
})

export const Timeline = (props: ProjectInfoProps) => {
  props.project.sprints.sort(
    (a: Sprint, b: Sprint) => b.startDate.getTime() - a.startDate.getTime()
  )
  const [, ...sprintsWithConnections] = props.project.sprints.reverse()

  const highlightedSprint = getCurrentSprint(props.project) || getNextSprint(props.project)

  const connectionColor = (toSprint: Sprint): ColorType =>
    highlightedSprint && toSprint.id === highlightedSprint.id ? 'accent-3' : 'accent-1'

  const connections = sprintsWithConnections.map((sprint: Sprint, index: number) =>
    connection(
      props.project.sprints[index].id,
      props.project.sprints[index + 1].id,
      connectionColor(props.project.sprints[index + 1])
    )
  )

  const [hoveredName, setHoveredName]: [
    undefined | string,
    React.Dispatch<React.SetStateAction<string | undefined>>
  ] = React.useState()

  return (
    <Stack guidingChild={1}>
      <Diagram key={`project-stack-diagram-${props.project.id}`} connections={connections} />
      <Box key={`project-stack-content-${props.project.id}`}>
        {props.project.sprints.map((sprint: Sprint, index: number) => (
          <SprintRowWrapper
            direction="row"
            gap="medium"
            align="center"
            key={`sprint-pairings-${sprint.id}`}
            isPast={isPastSprint(sprint)}
          >
            <ConnectionsColumn direction="row">
              <SprintRowTitleBox
                pad={{ right: "medium" }}
                align="center"
                highlight={highlightedSprint ? highlightedSprint.id === sprint.id : false}
              >
                <MonospaceText size="small">{`Sprint ${(index + 1).toString()}`}</MonospaceText>
                <MonospaceText size="xsmall">
                  {`${formatDate(sprint.startDate, 'MMM dd')} - ${formatDate(
                    sprint.endDate,
                    'MMM dd'
                  )}`}
                </MonospaceText>
              </SprintRowTitleBox>
              <Box
                width="30px"
                height="30px"
                id={markerIdForSprintId(sprint.id)}
                round="50%"
                background={
                  isPastSprint(sprint)
                    ? 'accent-3'
                    : highlightedSprint && sprint.id === highlightedSprint.id
                    ? 'accent-2'
                    : 'accent-1'
                }
              />
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
          </SprintRowWrapper>
        ))}
      </Box>
    </Stack>
  )
}

type CustomTextProps = TextProps & {
  hoveredName: undefined | string
  name: string
}

const MonospaceText = styled(Text)`
  font-family: 'Source Code Pro';
`

const SprintRowTitleBox = styled(Box)<BoxProps & { highlight: boolean }>`
  font-weight: ${props => (props.highlight ? 'bold' : 'normal')};
`

const CustomText = styled(MonospaceText)<CustomTextProps>`
  span {
    line-height: 0.35em;
    border-bottom-color: #f986f3ad;
    display: inline-block;
    border-bottom-style: solid;
    border-bottom-width: ${props => (props.name === props.hoveredName ? '6px' : '0')};
  }
`

const ConnectionsColumn = styled(Box)``
const PairsColumn = styled(Box)``
const SprintRowWrapper = styled(Box)<BoxProps & { isPast: boolean }>`
  opacity: ${props => (props.isPast ? '0.6' : '1.0')};
`
