import React from 'react'

export interface VahorProps {}

export const Vahor = ({}: VahorProps) => {
  return <div className="fixed bottom-8">
     <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/Vahor"
        className='text-neutral-700 dark:text-pink-200 text-lg md:text-xl font-bold text-center fade-1'
    >
            Made by Vahor
          </a>
  </div>;
}