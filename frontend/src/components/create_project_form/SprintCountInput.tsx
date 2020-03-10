import * as React from 'react'

import { TextInput } from 'grommet'

export const SprintCountInput = () => {
  const [value, setValue] = React.useState(1)

  const onChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.valueAsNumber)
    // setValue((event.target && event.target.value) || '')
  }

  return (
    <TextInput
      type="number"
      value={value}
      onChange={onChange}
      placeholder={<span>Enter something...</span>}
    />
  )
}
