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
  ResponsiveContext,
} from 'grommet'

import {
  getCurrentSprint,
  getNextSprint,
  isPastSprint,
  sortedSprints,
  isLastSprint,
} from '../../projectDateCalculations'

import { Engineers } from './Engineers'
import { ColorType } from 'grommet/utils'
import { format as formatDate } from 'date-fns/esm'

type ProjectInfoProps = {
  project: Project
}

const anchor: DiagramConnectionAnchor = 'vertical'
const type: DiagramConnectionType = 'curved'

const markerIdForSprintId = (sprintId: number) => `diagram-marker-${sprintId.toString()}`

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

export const Timeline = ({ project }: ProjectInfoProps) => {
  const sprints = sortedSprints(project.sprints)
  const [, ...sprintsWithConnections] = sprints
  const highlightedSprint = getCurrentSprint(project) || getNextSprint(project)

  const connectionColor = (toSprint: Sprint): ColorType =>
    highlightedSprint && toSprint.id === highlightedSprint.id ? 'accent-3' : 'accent-1'

  const connections = sprintsWithConnections.map((_sprint: Sprint, index: number) =>
    connection(sprints[index].id, sprints[index + 1].id, connectionColor(sprints[index + 1]))
  )

  const [hoveredName, setHoveredName]: [
    undefined | string,
    React.Dispatch<React.SetStateAction<string | undefined>>
  ] = React.useState()

  const size = React.useContext(ResponsiveContext)

  const isHighlightedSprint = (sprint: Sprint) =>
    Boolean(highlightedSprint && highlightedSprint.id === sprint.id)

  const EngineerName = ({
    name,
    highlightedName,
    highlightedSprint,
  }: {
    name: string
    highlightedName: boolean
    highlightedSprint: boolean
  }) => (
    <CustomText
      highlighted={highlightedName}
      weight={highlightedSprint ? 'bold' : 'normal'}
      onMouseEnter={() => setHoveredName(name)}
      onMouseLeave={() => setHoveredName(undefined)}
    >
      <span>{name}</span>
    </CustomText>
  )

  return (
    <Stack guidingChild={1}>
      <Diagram key={`project-stack-diagram-${project.id}`} connections={connections} />
      <Box key={`project-stack-content-${project.id}`}>
        {sprints.map((sprint: Sprint, index: number) => (
          <SprintRowWrapper
            direction="row"
            gap="medium"
            align="center"
            key={`sprint-pairings-${sprint.id}`}
            isPast={isPastSprint(sprint)}
          >
            <TimelineConnector
              size={size}
              highlight={isHighlightedSprint(sprint)}
              sprint={sprint}
              title={`Sprint ${(index + 1).toString()}`}
            />
            <PairsColumn
              flex="grow"
              justify="center"
              width={{ max: size === 'small' ? '65%' : size === 'medium' ? '70%' : '75%' }}
            >
              <Box
                pad="small"
                direction="row"
                border={!isLastSprint(project, sprint) && 'bottom'}
                wrap
              >
                {sprint.pairs.map(([eng1, eng2]: [Engineer, Engineer], index: number) => (
                  <Engineers
                    imageWidth="20px"
                    imageHeight="20px"
                    key={`${eng1.name}-${eng2.name}`}
                    index={index}
                  >
                    <EngineerName
                      name={eng1.name}
                      highlightedName={eng1.name === hoveredName}
                      highlightedSprint={Boolean(
                        highlightedSprint && highlightedSprint.id === sprint.id
                      )}
                    />
                    <EngineerName
                      name={eng2.name}
                      highlightedName={eng2.name === hoveredName}
                      highlightedSprint={Boolean(
                        highlightedSprint && highlightedSprint.id === sprint.id
                      )}
                    />
                  </Engineers>
                ))}
                {sprint.soloEngineer && (
                  <Engineers imageWidth="20px" imageHeight="20px">
                    <EngineerName
                      name={sprint.soloEngineer.name}
                      highlightedName={sprint.soloEngineer.name === hoveredName}
                      highlightedSprint={Boolean(
                        highlightedSprint && highlightedSprint.id === sprint.id
                      )}
                    />
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

const TimelineConnector = ({
  size,
  highlight,
  sprint,
  title,
}: {
  size: string
  highlight: boolean
  sprint: Sprint
  title: string
}) => (
  <ConnectionsColumn direction={size === 'small' ? 'column' : 'row'}>
    {size === 'small' && (
      <SprintRowTitleBox
        background={isPastSprint(sprint) ? 'accent-3' : highlight ? 'accent-2' : 'accent-1'}
        color="white"
        round="5px"
        pad={{ horizontal: 'xlarge', vertical: 'medium' }}
        align="center"
        highlight={highlight}
        id={markerIdForSprintId(sprint.id)}
      >
        <MonospaceText size="small">{title}</MonospaceText>
        <MonospaceText size="xsmall">
          {`${formatDate(sprint.startDate, 'MMM dd')} - ${formatDate(sprint.endDate, 'MMM dd')}`}
        </MonospaceText>
      </SprintRowTitleBox>
    )}
    {size !== 'small' && (
      <>
        <SprintRowTitleBox pad={{ right: 'medium' }} align="center" highlight={highlight}>
          <MonospaceText size="small">{title}</MonospaceText>
          <MonospaceText size="xsmall">
            {`${formatDate(sprint.startDate, 'MMM dd')} - ${formatDate(sprint.endDate, 'MMM dd')}`}
          </MonospaceText>
        </SprintRowTitleBox>
        <Box
          width="30px"
          height="30px"
          id={markerIdForSprintId(sprint.id)}
          round="50%"
          background={isPastSprint(sprint) ? 'accent-3' : highlight ? 'accent-2' : 'accent-1'}
        />
      </>
    )}
  </ConnectionsColumn>
)

const MonospaceText = styled(Text)`
  font-family: 'Source Code Pro';
  white-space: pre;
`

const SprintRowTitleBox = styled(Box)<BoxProps & { highlight: boolean }>`
  font-weight: ${props => (props.highlight ? 'bold' : 'normal')};
  color: ${props => props.color === 'white' && 'white'};
`

type CustomTextProps = TextProps & {
  highlighted: boolean
}

const CustomText = styled(MonospaceText)<CustomTextProps>`
  span {
    line-height: 0.35em;
    border-bottom-color: #f986f3ad;
    display: inline-block;
    border-bottom-style: solid;
    border-bottom-width: ${props => (props.highlighted ? '6px' : '0')};
  }
`

const ConnectionsColumn = styled(Box)``
const PairsColumn = styled(Box)``
const SprintRowWrapper = styled(Box)<BoxProps & { isPast: boolean }>`
  opacity: ${props => (props.isPast ? '0.6' : '1.0')};
`
