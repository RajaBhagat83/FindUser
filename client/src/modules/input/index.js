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
      <label for={name} className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        id={name}
        className={`bg-gray-50 border border-gray-200 text-gray-800 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-transparent block w-full px-3 py-2.5 text-sm placeholder-gray-400 outline-none transition-all ${inputClassname}`}
        placeholder={placeholder}
        required={isRequired}
        onChange={onChange}
        value={value}
      />
    </div>
  )
}

export default Input