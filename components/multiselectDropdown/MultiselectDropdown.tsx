import React, { useMemo, useRef, useState } from 'react'
import { Select, Spin } from 'antd'
import type { SelectProps } from 'antd'
import debounce from 'lodash/debounce'
import { DefaultOptionType } from 'antd/es/select'
import { Guest } from '@/core/types'
import './MultiselectDropdown.css'

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<Guest[]>
  debounceTimeout?: number
  eventId: string
}

function MultiselectDropdown<ValueType>({
  fetchOptions,
  debounceTimeout = 800,
  eventId,
  ...props
}: DebounceSelectProps<ValueType[]>) {
  const [fetching, setFetching] = useState(false)
  const [options, setOptions] = useState<{ label: string; value: string }[]>([])
  const fetchRef = useRef(0)

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1
      const fetchId = fetchRef.current
      setOptions([])
      setFetching(true)

      fetchOptions(eventId).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return
        }
        const filteredOptions = newOptions
          .filter((option) => option.guestInfo.name.includes(value))
          .map((opt) => {
            return { value: opt.guestInfo.name, label: opt.guestInfo.name }
          })

        setOptions(filteredOptions)
        setFetching(false)
      })
    }

    return debounce(loadOptions, debounceTimeout)
  }, [fetchOptions, debounceTimeout])

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  )
}

export default MultiselectDropdown
