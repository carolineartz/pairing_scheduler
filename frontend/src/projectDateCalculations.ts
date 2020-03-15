import {
  isWithinInterval,
  isWeekend,
  eachDayOfInterval,
  addBusinessDays,
  subBusinessDays,
  toDate,
  isFuture,
} from 'date-fns/esm'

export type SingleDateRangeObject = {
  startDate: Date
  endDate: Date
  key: string
}

export type SequentialDirection = 'backwards' | 'forwards'

export const getCurrentSprint = (project: Project): Sprint | undefined =>
  project.sprints.find((sprint: Sprint) =>
    isWithinInterval(toDate(Date.now()), { start: sprint.startDate, end: sprint.endDate })
  )

export const getNextSprint = (project: Project): Sprint | undefined => {
  return sortedSprints(project.sprints).find((sprint: Sprint) => isFuture(sprint.startDate))
}
export const getFirstSprint = (project: Project): Sprint => project.sprints[0]

export const initialSelectedSprint = (project: Project) =>
  getCurrentSprint(project) || getFirstSprint(project)

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

export const getNextSprintInSequence = (
  project: Project,
  currentSprint: Sprint,
  direction: SequentialDirection
): Sprint => {
  const dateFn: (date: Date, amount: number) => Date =
    direction === 'backwards' ? addBusinessDays : subBusinessDays
  const indexDate: Date = direction === 'forwards' ? currentSprint.endDate : currentSprint.startDate

  return getSprintForDate(project, dateFn(indexDate, 1)) || currentSprint
}

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
