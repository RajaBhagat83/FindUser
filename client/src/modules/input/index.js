import React from 'react'

function Input({
  label="",
  name="",
  type="text",
  placeholder="",
  className="",
  inputClassname="",
  isRequired=false,
  value,
  onChange
}) {
  return (
    <div className={`w-1/2 ${className}`}>
            <label for={name} className="block mb-2.5 text-sm font-medium text-heading">{label}</label>
            <input type={type}id={name} className={`bg-neutral-secondary-medium border border-default-medium text-heading  rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs ${inputClassname} 
           `} placeholder={placeholder} required={ isRequired} onChange={onChange} value= {value}  />
    </div>
  )
}
export default Input
