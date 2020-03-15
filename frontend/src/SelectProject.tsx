import * as React from 'react'
import { Box, Button, Keyboard, TextInput } from 'grommet'
import { Search as SearchIcon } from 'grommet-icons'

// const allProjects = structure.sections
//   .map(section => (section.components || []).concat(section.name))
//   .concat(structure.externals.map(e => e.name))
//   .reduce((acc, val) => acc.concat(val), [])
//   .sort()

type ProjectData = {
  id: number
  name: string
}

type ProjectSelectProps = {
  open: boolean
  setOpen: any
  projects: ProjectData[]
  goToIndex: Function
}

const SelectProject = ({ open, setOpen, projects, goToIndex }: ProjectSelectProps) => {
  const indexOfProject = (name: string) => {
    const index = projects.findIndex((project: ProjectData) => project.name === name)
    if (index >= 0) {
      return index + 1
    }
  }
  const allProjects = projects.map((project: ProjectData) => project.name)

  const [value, setValue] = React.useState('')
  const [suggestions, setSuggestions] = React.useState(allProjects)
  const inputRef: React.RefObject<any> = React.createRef()

  React.useEffect(() => {
    if (inputRef.current && open) {
      inputRef.current.focus()
    }
  }, [open])

  const onChange = (event?: any) => {
    if (event && event.value) {
      // const onChange = ({ event: { value: nextValue } }: { event: { value: string } }) => {
      let nextSuggestions
      // event.currentTarget.value
      if (event.value) {
        const regexp = new RegExp(event.value, 'i')
        nextSuggestions = allProjects.filter(c => regexp.test(c))
      } else {
        nextSuggestions = allProjects
      }

      // don't use newer value if nothing matches it
      if (nextSuggestions.length > 0) {
        setValue(event.value)
        setSuggestions(nextSuggestions)
      }
    }
  }

  const onEnter = () => {
    if (value) {
      if (suggestions.length === 1) {
        goToIndex(indexOfProject(value))
      } else {
        const matches = allProjects.filter(c => c.toLowerCase() === value.toLowerCase())
        if (matches.length === 1) {
          goToIndex(indexOfProject(matches[0]))
        }
      }
    }
  }

  const onSelect = ({ suggestion }: { suggestion: string }) => {
    goToIndex(indexOfProject(suggestion))
  }

  if (open) {
    return (
      <Keyboard
        onEsc={() => {
          setOpen(false)
        }}
        onEnter={onEnter}
      >
        <TextInput
          ref={inputRef}
          name="search-components"
          dropHeight="medium"
          placeholder="search..."
          value={value}
          suggestions={suggestions}
          onChange={onChange as any}
          onSelect={onSelect}
          onSuggestionsOpen={() => {
            setOpen(true)
          }}
          onSuggestionsClose={() => {
            setOpen(false)
          }}
        />
      </Keyboard>
    )
  }

  return (
    <Button
      plain
      onClick={() => {
        setOpen(true)
      }}
    >
      {({ hover }: { hover: any }) => (
        <Box round="xlarge" pad="small" background={hover ? 'active' : undefined}>
          <SearchIcon />
        </Box>
      )}
    </Button>
  )
}

export default SelectProject