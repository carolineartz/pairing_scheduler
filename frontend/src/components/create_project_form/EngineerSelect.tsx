import * as React from 'react'

import { Box, Button, SelectProps, Text, Select } from 'grommet'

import { FormClose } from 'grommet-icons'

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

type EngineerSelectProps = Omit<SelectProps, 'options'> & {
  initialOptions: string[]
}

export const EngineerSelect = ({ initialOptions, ...restProps }: EngineerSelectProps) => {
  const [options, setOptions] = React.useState(initialOptions)
  // const [value, setValue] = React.useState('')
  const [selected, setSelected] = React.useState([] as number[])
  const [searchValue, setSearchValue] = React.useState('')

  const onRemoveName = (name: string) => {
    const nameIndex = options.indexOf(name)
    setSelected(selected.filter(selectedSeason => selectedSeason !== nameIndex))
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
      // placeholder="Select"
      multiple
      valueLabel={
        <Box wrap direction="row" width="small">
          {selected && selected.length ? (
            selected.map(index => renderEngineerName(options[index]))
          ) : (
            <Box pad={{ vertical: 'xsmall', horizontal: 'small' }} margin="xsmall">
              Select Engineer
            </Box>
          )}
        </Box>
      }
      // value={selected}
      selected={selected}
      options={options}
      onChange={({ option, selected: nextSelected }: { option: string; selected: number[] }) => {
        // debugger
        if (option.includes(prefix)) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [_createOption, ...opts] = options
          setOptions([...opts, searchValue])
          // initialOptions.pop() // remove Create option
          // initialOptions.push(searchValue)

          setSelected([...selected, options.indexOf(searchValue)].sort())
          // setValue(searchValue)
        } else {
          setSelected([...nextSelected].sort())
        }
      }}
      // onSearch={(text: string) => {
      //   updateCreateOption(text, options)
      //   const exp = getRegExp(text)
      //   setOptions(options.filter(o => exp.test(o)))
      //   setSearchValue(text)
      // }}
      {...restProps}
    >
      {renderOption}
    </Select>
  )
}

// import React, { useState } from 'react'
// import { storiesOf } from '@storybook/react'

// import { grommet } from 'grommet/themes'

// const allSeasons = ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S10']

// const SeasonsSelect = () => {
//   const [selected, setSelected] = useState([])

//   const renderOption = (option, state) => (
//     <Box pad="small" background={state.active ? 'active' : undefined}>
//       {option}
//     </Box>
//   )

//   return (
//     <Grommet full theme={grommet}>
//       <Box fill align="center" justify="center">
//         <Select
//           closeOnChange={false}
//           multiple
//           value={
//             <Box wrap direction="row" width="small">
//               {selected && selected.length ? (
//                 selected.map(index => renderSeason(allSeasons[index]))
//               ) : (
//                 <Box pad={{ vertical: 'xsmall', horizontal: 'small' }} margin="xsmall">
//                   Select Season
//                 </Box>
//               )}
//             </Box>
//           }
//           options={allSeasons}
//           selected={selected}
//           disabled={[2, 6]}
//           onChange={({ selected: nextSelected }) => {
//             setSelected([...nextSelected].sort())
//           }}
//         >
//           {renderOption}
//         </Select>
//       </Box>
//     </Grommet>
//   )
// }
