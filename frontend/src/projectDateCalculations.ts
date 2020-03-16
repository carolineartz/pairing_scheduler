import {
  isWithinInterval,
  isWeekend,
  eachDayOfInterval,
  addBusinessDays,
  subBusinessDays,
  toDate,
  isFuture,
  isPast,
} from 'date-fns/esm'

export type SingleDateRangeObject = {
  startDate: Date
  endDate: Date
  key: string
}

export type SequentialDirection = 'backwards' | 'forwards'

export const isPastSprint = (sprint: Sprint): boolean => isPast(sprint.endDate)

export const isCurrentSprint = (sprint: Sprint): boolean =>
  isWithinInterval(toDate(Date.now()), { start: sprint.startDate, end: sprint.endDate })

export const isLastSprint = (project: Project, sprint: Sprint): boolean => {
  const lastSprint = getLastSprint(project)
  return Boolean(lastSprint && lastSprint.id === sprint.id)
}

export const getCurrentSprint = (project: Project): Sprint | undefined =>
  project.sprints.find((sprint: Sprint) => isCurrentSprint(sprint))

export const getNextSprint = (project: Project): Sprint | undefined => {
  return sortedSprints(project.sprints).find((sprint: Sprint) => isFuture(sprint.startDate))
}
export const getFirstSprint = (project: Project): Sprint => project.sprints[0]

export const getLastSprint = (project: Project): Sprint | undefined =>
  sortedSprints(project.sprints)[project.sprints.length - 1]

export const getSprintForDate = (project: Project, date: Date): Sprint | undefined =>
  project.sprints.find((sprint: Sprint) =>
    isWithinInterval(date, { start: sprint.startDate, end: sprint.endDate })
  )

export const calculateDateRange = (sprint: Sprint): SingleDateRangeObject => ({
  startDate: sprint.startDate,
  endDate: sprint.endDate,
  key: 'selection',
})

export const getInvalidDates = (project: Project): Date[] =>
  eachDayOfInterval({
    start: project.startDate,
    end: project.endDate,
  }).filter((date: Date) => isWeekend(date))

export const getNextSequentialSprint = (
  project: Project,
  currentSprint: Sprint,
  scrollingDirection: SequentialDirection
): Sprint => {
  const dateFn: (date: Date, amount: number) => Date =
    scrollingDirection === 'forwards' ? addBusinessDays : subBusinessDays
  const indexDate: Date =
    scrollingDirection === 'forwards' ? currentSprint.endDate : currentSprint.startDate
  return getSprintForDate(project, dateFn(indexDate, 1)) || currentSprint
}

export const indexOfSprint = (project: Project, sprint: Sprint): number =>
  project.sprints.indexOf(sprint)

export const sortedSprints = (sprints: Sprint[]) =>
  sprints.sort((a: Sprint, b: Sprint) => b.startDate.getTime() - a.startDate.getTime()).reverse()
