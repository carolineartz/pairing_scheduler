import * as React from 'react'

import { Box, Button, Form, FormField, TextInput, Select } from 'grommet'
import { EngineerSelect } from './create_project_form/EngineerSelect'

export const CreateProjectForm = () => {
  return (
    <Form
      onReset={(event: React.SyntheticEvent) => console.log(event)}
      onSubmit={({ value, touched }: any) => console.log('Submit', value, touched)}
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
      <Box direction="row" justify="between" margin={{ top: 'medium' }}>
        <Button type="submit" label="Update" primary />
      </Box>
    </Form>
  )
}
