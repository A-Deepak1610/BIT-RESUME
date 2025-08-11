import React from 'react'
import Info from './info/Info'
import Content from './content/Content'

export default function Resume () {
  return (
    <div>
      <div className="flex flex-col lg:flex-row  w-full  bg-gray-100 h-full">
        <div>
          <Info />
        </div>
        <div className="p-3 flex-1 ">
          <Content />
        </div>
      </div>
    </div>
  );
}