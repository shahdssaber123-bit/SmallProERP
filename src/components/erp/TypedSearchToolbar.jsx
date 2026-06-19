import React from 'react';
import SearchToolbar from './SearchToolbar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TypedSearchToolbar({ value, onChange, type, onTypeChange, options = [], children }) {
  const current = options.find(o => o.value === type) || options[0];
  return (
    <SearchToolbar value={value} onChange={onChange} placeholder={current ? `Search by ${current.label}...` : 'Search...'}>
      <Select value={type} onValueChange={onTypeChange}>
        <SelectTrigger className="w-[190px] h-10 rounded-xl text-sm"><SelectValue placeholder="Search By" /></SelectTrigger>
        <SelectContent>
          {options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
        </SelectContent>
      </Select>
      {children}
    </SearchToolbar>
  );
}
