function createCalendar(year, month) {
    
    console.log("START: CreateCalendar");

    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    // Add empty cells at the start if the first day of the month is not Sunday
    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('day');
        calendar.appendChild(emptyCell);
    }

    // Create a cell for each day in the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day');
        dayCell.textContent = day;
        calendar.appendChild(dayCell);
    }

    console.log("END: CreateCalendar");

}

// Initialize calendar for January 2024
createCalendar(2024, 1);
