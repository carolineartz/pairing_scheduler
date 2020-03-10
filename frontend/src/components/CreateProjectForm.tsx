import * as React from 'react'

import { Box, Button, Form, FormField, TextInput, Select } from 'grommet'
import { SprintCountInput } from './create_project_form/SprintCountInput'
import { EngineerSelect } from './create_project_form/EngineerSelect'

// the prefix name of the Create option entry
const prefix = 'Create'

// const defaultOptions: string[] = []

// for (let i = 1; i <= 5; i += 1) {
//   defaultOptions.push(`option ${i}`)
// }

const updateCreateOption = (text: string, options: string[]) => {
  const len = options.length
  if (options[len - 1].includes(prefix)) {
    // remove Create option before adding an updated one
    options.pop()
  }
  options.push(`${prefix} '${text}'`)
}

// improving Search support of special characters
const getRegExp = (text: string) => {
  // The line below escapes regular expression special characters:
  // [ \ ^ $ . | ? * + ( )
  const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')

  // Create the regular expression with modified value which
  // handles escaping special characters. Without escaping special
  // characters, errors will appear in the console
  return new RegExp(escapedText, 'i')
}

export const CreateProjectForm = () => {
  // const [value, setValue] = React.useState(1)

  // const onChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
  //   setValue(event.currentTarget.valueAsNumber)
  // }

  const defaultOptions = ['eng1', 'eng2', 'eng3']

  const [options, setOptions] = React.useState(defaultOptions)
  const [value, setValue] = React.useState('')
  const [searchValue, setSearchValue] = React.useState('')

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
      />
      <FormField name="engineer_names">
        <EngineerSelect initialOptions={['caroline', 'josh']} name="engineer_names" />
      </FormField>
      <Box direction="row" justify="between" margin={{ top: 'medium' }}>
        <Button type="submit" label="Update" primary />
      </Box>
    </Form>
  )
}

      // <FormField
      //   label="Engineers"
      //   name="engineer_names"
      //   component={Select}
      //   options={options}
      //   placeholder="Select"
      //   value={value}
      //   // options={options}
      //   onChange={({ option }: any) => {
      //     if (option.includes(prefix)) {
      //       defaultOptions.pop() // remove Create option
      //       defaultOptions.push(searchValue)
      //       setValue(searchValue)
      //     } else {
      //       setValue(option)
      //     }
      //   }}
      //   // onClose={() => setOptions(options)}
      //   onSearch={(text: string) => {
      //     updateCreateOption(text, options)
      //     const exp = getRegExp(text)
      //     setOptions(options.filter(o => exp.test(o)))
      //     setSearchValue(text)
      //   }}
      // />