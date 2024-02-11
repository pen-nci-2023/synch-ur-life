// app/components/Calendar/Calendar.js

import React, { useState, useEffect } from 'react';

const Calendar = ({ year, month }) => {
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    console.log("START: CreateCalendar");

    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
    const daysArray = [];

    // Add empty cells at the start if the first day of the month is not Sunday
    for (let i = 0; i < firstDayOfWeek; i++) {
      daysArray.push(<div key={`empty-${i}`} className="day"></div>);
    }

    // Create a cell for each day in the month
    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push(<div key={`day-${day}`} className="day">{day}</div>);
    }

    setCalendarDays(daysArray);
    console.log("END: CreateCalendar");
  }, [year, month]); // Depend on year and month props

  return (
    <div id="calendar-container">
      <div id="calendar-header">January 2024</div>
      <div id="calendar">
        {calendarDays}
      </div>
    </div>
  );
};

export default Calendar;
