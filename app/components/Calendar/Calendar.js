import React from 'react';

const Calendar = ({ year, month }) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const emptyCells = Array.from({ length: firstDayOfWeek }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div id="calendar">
      {emptyCells.map((_, i) => (
        <div key={`empty-${i}`} className="day"></div>
      ))}
      {days.map(day => (
        <div key={`day-${day}`} className="day">{day}</div>
      ))}
    </div>
  );
};

export default Calendar;
