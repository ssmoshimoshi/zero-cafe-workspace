const str = new Date(2026, 6, 1).toString();
console.log(str);
console.log(new Date(str).getTime() === new Date(2026, 6, 1).getTime());
