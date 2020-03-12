import * as React from 'react'

import { Box, Button, SelectProps, Text, Select } from 'grommet'

import { FormClose } from 'grommet-icons'

// the prefix name of the Create option entry
const prefix = 'Create'

const updateCreateOption = (text: string, options: string[]) => {
  const len = options.length
  if (options[len - 1].includes(prefix)) {
    options.pop() // remove Create option before adding an updated one
  }
  // only add the new Create option if the exact string doesn't already exist
  if (text && !options.includes(text)) {
    options.push(`${prefix} '${text}'`)
  }
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

type EngineerSelectProps = Omit<SelectProps, 'options'> & {
  initialOptions: string[]
}

export const EngineerSelect = ({ initialOptions, ...restProps }: EngineerSelectProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [allOptions, setAllOptions] = React.useState(initialOptions)
  const [options, setOptions] = React.useState(initialOptions)
  const [selected, setSelected] = React.useState([] as number[])
  const [searchValue, setSearchValue] = React.useState('')

  // need to get ref to change the actual value here so that validation works when names are removed.
  const onRemoveName = (name: string) => {
    const nameIndex = options.indexOf(name)
    setSelected(sel => sel.filter(selectedNameIndex => selectedNameIndex !== nameIndex))
  }
  const renderEngineerName = (name: string) => (
    <Button
      key={`engineer_name_${name}`}
      href="#"
      onClick={event => {
        event.preventDefault()
        event.stopPropagation()
        onRemoveName(name)
      }}
      onFocus={event => event.stopPropagation()}
    >
      <Box
        align="center"
        direction="row"
        gap="xsmall"
        pad={{ vertical: 'xsmall', horizontal: 'small' }}
        margin="xsmall"
        background="accent-1"
        round="large"
      >
        <Text size="small" color="white">
          {name}
        </Text>
        <Box background="white" round="full" margin={{ left: 'xsmall' }}>
          <FormClose color="accent-1" size="small" style={{ width: '12px', height: '12px' }} />
        </Box>
      </Box>
    </Button>
  )

  const renderOption = (option: string, state: any) => (
    <Box pad="small" background={state.active ? 'active' : undefined}>
      {option}
    </Box>
  )

  return (
    <Select
      size="medium"
      closeOnChange={false}
      multiple
      plain
      valueLabel={
        <Box wrap direction="row">
          {selected && selected.length ? (
            selected.map(index => renderEngineerName(allOptions[index]))
          ) : (
            <Box pad={{ vertical: 'xsmall', horizontal: 'small' }} margin="xsmall">
              Select Engineers
            </Box>
          )}
        </Box>
      }
      selected={selected}
      options={options}
      onChange={({ option, selected: nextSelected }: { option: string; selected: number[] }) => {
        if (option.includes(prefix)) {
          allOptions.pop() // remove "Create <search value>" option
          allOptions.push(searchValue)
          setOptions(allOptions)

          const newSelected = [...selected, allOptions.length - 1].sort()
          setSelected(newSelected)
        } else {
          setSelected(nextSelected)
        }
      }}
      onClose={() => {
        console.log(selected)
        setOptions(allOptions)
      }}
      onSearch={(text: string) => {
        if (searchValue || text) {
          updateCreateOption(text, allOptions)
          const exp = getRegExp(text)
          setOptions(allOptions.filter(o => exp.test(o)))
        }
        setSearchValue(text)
      }}
      {...restProps}
    >
      {renderOption}
    </Select>
  )
}
