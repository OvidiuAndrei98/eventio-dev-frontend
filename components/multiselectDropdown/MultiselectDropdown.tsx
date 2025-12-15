import React, { useMemo, useState } from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import './MultiselectDropdown.css';

/// This component is a custom multi-select dropdown that fetches options from an API
/// based on user input. It uses the Ant Design Select component and adds a debounce
/// functionality to limit the number of API calls made while the user types in the search box.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType>, 'options' | 'children'> {
  options?: { label: string; value: string }[];
}

function MultiselectDropdown<ValueType>({
  options = [],
  ...props
}: DebounceSelectProps<ValueType[]>) {
  const [searchValue, setSearchValue] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchValue) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [options, searchValue]);

  return (
    <Select
      labelInValue
      filterOption={false}
      searchValue={searchValue}
      onSearch={setSearchValue}
      {...props}
      options={filteredOptions}
    />
  );
}

export default MultiselectDropdown;
