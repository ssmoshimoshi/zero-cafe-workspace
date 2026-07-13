const parts = "10-07-2026".split("-");
console.log(new Date(parts[2], parseInt(parts[1], 10) - 1, parts[0]));

const d = new Date(2026, 6, 1);
const dayOfWeek = d.getDay();
const adjustedDay = (dayOfWeek === 0) ? 6 : dayOfWeek - 1;
const mondayDate = new Date(d.getFullYear(), d.getMonth(), d.getDate() - adjustedDay);
console.log("July 1 monday:", mondayDate);
