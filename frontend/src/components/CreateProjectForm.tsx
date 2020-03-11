import * as React from 'react'

import { Box, Button, Form, FormField } from 'grommet'
import { EngineerSelect } from './create_project_form/EngineerSelect'
// import { ProjectStartDatePicker } from './create_project_form/ProjectStartDatePicker'

// import { Box, Button, TextInput, Text, Select, TextInputProps } from 'grommet'

import {
  eachDayOfInterval,
  formatISO,
  startOfWeek,
  startOfToday,
  add as addToDate,
  isMonday,
} from 'date-fns'
import { Calendar } from 'react-date-range'

export const CreateProjectForm = () => {
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
      onSubmit={({ value, touched }: any) =>
        // eslint-disable-next-line @typescript-eslint/camelcase
        console.log('Submit', { start_date: formatISO(date), ...value }, touched)
      }
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
        <EngineerSelect initialOptions={['caroline', 'josh']} name="engineer_names" />
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
