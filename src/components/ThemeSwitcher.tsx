import { useTheme } from 'next-themes';
import React from 'react'

import toast from "react-hot-toast";
export interface ThemeSwitcherProps { }

export const ThemeSwitcher = ({ }: ThemeSwitcherProps) => {
    const { theme, setTheme } = useTheme();
    const setCurrentTheme = (theme: string) => {
        toast.success(`Theme set to ${theme}`);
        setTheme(theme);
    }

    return <label className={`flex items-center relative mb-4 cursor-pointer`}>
        <input type="checkbox" className="sr-only"
            checked={theme === "dark"}
            onChange={(e) => setCurrentTheme(e.target.checked ? "dark" : "light")}
        />
        <div className="toggle-bg bg-gray-700 dark:bg-gray-200 border-2 border-gray-700 dark:border-gray-200 h-6 w-11 rounded-full"></div>
        <span className="ml-2 md:ml-3 text-neutral-700 dark:text-pink-300 text-sm font-medium">Dark Mode</span>
    </label>
}