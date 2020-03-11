/* eslint-disable @typescript-eslint/camelcase */
import * as React from 'react'

import { Box, Button, Form, FormField } from 'grommet'
import { EngineerSelect } from './create_project_form/EngineerSelect'

import {
  eachDayOfInterval,
  formatISO,
  startOfWeek,
  startOfToday,
  add as addToDate,
  isMonday,
} from 'date-fns'
import { Calendar } from 'react-date-range'

type CreateProjectFormProps = {
  engineers: Engineer[]
  onSubmit: ({
    engineer_names,
    start_date,
    sprint_count,
  }: {
    engineer_names: string[]
    start_date: string
    sprint_count: string
  }) => void
}

export const CreateProjectForm = ({ engineers, onSubmit }: CreateProjectFormProps) => {
  const startOfValidDates = startOfWeek(startOfToday())
  const endOfValidDates = addToDate(startOfValidDates, { months: 6 })
  const invalidDates = eachDayOfInterval({
    start: startOfValidDates,
    end: endOfValidDates,
  }).filter((date: Date) => !isMonday(date))

  const [date, setDate] = React.useState(null as any)

  return (
    <Form
      onReset={(event: React.SyntheticEvent) => console.log(event)}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onSubmit={({ value, touched }: any) => onSubmit({ ...value, start_date: formatISO(date) })}
    >
      <FormField
        label="Sprint Count"
        name="sprint_count"
        required
        validate={{ regexp: /^[0-9]+$/, message: 'number' }}
        placeholder={<span>Enter the number of sprints to schedule...</span>}
        type="number"
      />
      <FormField name="engineer_names" label="Engineering Team">
        {engineers.length > 0 && (
          <EngineerSelect
            initialOptions={engineers.map((eng: Engineer) => eng.name)}
            name="engineer_names"
          />
        )}
      </FormField>

      <FormField label="Start Date">
        <Box align="start">
          <Calendar
            // minDate={startOfValidDates}
            // disabledDates={invalidDates}
            date={date}
            onChange={(evt: any) => setDate(evt)}
          />
        </Box>
      </FormField>
      <Box direction="row" justify="between" margin={{ top: 'medium' }}>
        <Button type="submit" label="Create" primary />
      </Box>
    </Form>
  )
}
