import React from 'react'

function SearchIcon({onChange}) {
  return (
    <div className='mb-9'>
      <form className="max-w-full mx-auto">
        <label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full py-2.5 ps-10 pe-4 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-transparent placeholder-gray-400 outline-none transition-all"
            placeholder="Search"
            required
            onChange={onChange}
          />
        </div>
      </form>
    </div>
  )
}

export default SearchIcon