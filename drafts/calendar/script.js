// app/components/Calendar/Calendar.js

import React from 'react';
import './Calendar.module.css'; // Ensure this path is correct

const Calendar = ({ year, month }) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

  // Generate empty cells
  const emptyCells = Array.from({ length: firstDayOfWeek }, (_, i) => <div key={`empty-${i}`} className="day"></div>);

  // Generate day cells
  const days = Array.from({ length: daysInMonth }, (_, i) => <div key={`day-${i + 1}`} className="day">{i + 1}</div>);

  return (
    <div id="calendar-container">
      <div id="calendar-header">January 2024</div>
      <div id="calendar">
        {emptyCells}
        {days}
      </div>
    </div>
  );
};

export default Calendar;
