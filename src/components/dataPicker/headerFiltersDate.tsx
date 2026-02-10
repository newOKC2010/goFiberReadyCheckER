'use client'

import { useState, useEffect, useRef } from 'react'
import HeaderFiltersYear from './headerFiltersYear'
import { DatePickerProps } from './handler/datePickerTypes'
import { 
  THAI_MONTHS, 
  THAI_DAYS, 
  formatThaiDate, 
  formatAPIDate, 
  getDaysInMonth, 
  navigateMonth, 
  createNewDateWithYear, 
  isSameDate, 
  isToday 
} from './handler/datePickerHandlers'

export default function HeaderFiltersDate({ selectedDate, onDateChange, closeCalendar }: DatePickerProps) {
    const [showCalendar, setShowCalendar] = useState(false)
    const [currentDate, setCurrentDate] = useState(new Date())
    const calendarRef = useRef<HTMLDivElement>(null)

    const handleDateSelect = (date: Date) => {
        const apiDate = formatAPIDate(date)
        onDateChange(apiDate)
        setShowCalendar(false)
    }

    const handleNavigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => navigateMonth(prev, direction))
    }

    const handleYearChange = (year: number) => {
        setCurrentDate(prev => createNewDateWithYear(prev, year))
    }

    // Close calendar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setShowCalendar(false)
            }
        }

        if (showCalendar) {
            document.addEventListener('mousedown', handleClickOutside)
            document.addEventListener('touchstart', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('touchstart', handleClickOutside)
        }
    }, [showCalendar])

    // Close calendar when parent requests it
    useEffect(() => {
        if (closeCalendar) {
            setShowCalendar(false)
        }
    }, [closeCalendar])

    return (
        <div ref={calendarRef} className="flex-1 max-w-full sm:max-w-xs relative">
            <label className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2">
                <span className="material-symbols-outlined text-blue-500 text-sm"
                style={{ 
                    fontVariationSettings: "'wght' 400",
                    fontSize: 'clamp(2rem, 5vw, 2rem)',
                    transition: 'all 0.3s ease'
                }}
                >Calendar_Check</span>
                วันที่
            </label>
            
            <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm 
                         hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition-all duration-200 font-bold text-gray-900 cursor-pointer"
            >
                <div className="flex items-center justify-between">
                    <span className={selectedDate ? "text-gray-900 font-bold" : "text-gray-500 font-bold"}>
                        {selectedDate ? formatThaiDate(selectedDate) : "เลือกวันที่"}
                    </span>
                    <span className="material-symbols-outlined text-gray-400">
                        {showCalendar ? 'expand_less' : 'expand_more'}
                    </span>
                </div>
            </button>

            {/* Thai Calendar Popup */}
            {showCalendar && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg 
                                animate-in fade-in-0 zoom-in-95 duration-200 p-4">
                    
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => handleNavigateMonth('prev')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-gray-600 font-bold">chevron_left</span>
                        </button>
                        
                        <div className="text-center">
                            <div className="text-lg font-bold text-gray-900 mb-1">
                                {THAI_MONTHS[currentDate.getMonth()]}
                            </div>
                            <HeaderFiltersYear 
                                currentYear={currentDate.getFullYear()}
                                onYearSelect={handleYearChange}
                            />
                        </div>
                        
                        <button
                            onClick={() => handleNavigateMonth('next')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-gray-600 font-bold">chevron_right</span>
                        </button>
                    </div>

                    {/* Days Header */}
                    <div className="grid grid-cols-7 gap-1 mb-2 ">
                        {THAI_DAYS.map(day => (
                            <div key={day} className="text-center text-xs font-bold text-gray-500 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 ">
                        {getDaysInMonth(currentDate).map((date, index) => (
                            <button
                                key={index}
                                onClick={() => date && handleDateSelect(date)}
                                disabled={!date}
                                className={`
                                    h-10 rounded-lg text-sm font-bold transition-colors cursor-pointer
                                    ${!date ? 'invisible' : 'hover:bg-blue-200 focus:bg-blue-100'}
                                    ${date && isSameDate(formatAPIDate(date), selectedDate) ? 
                                        'bg-blue-500 text-white hover:bg-blue-600' : 
                                        'text-gray-900'
                                    }
                                    ${date && isToday(date) ? 
                                        'ring-2 ring-blue-300' : ''
                                    }
                                `}
                            >
                                {date?.getDate()}
                            </button>
                        ))}
                    </div>

                    {/* Today Button */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                        <button
                            onClick={() => handleDateSelect(new Date())}
                            className="w-full py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 
                                     font-bold rounded-lg transition-colors border border-blue-200 cursor-pointer"
                        >
                            เลือกวันที่
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}