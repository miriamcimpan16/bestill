// Returnează data de Luni pentru săptămâna dată
export function getMondayOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // ajustare dacă e duminică
  return new Date(date.setDate(diff));
}

// Returnează data de Duminică pentru săptămâna dată
export function getSundayOfWeek(date: Date): Date {
  const monday = getMondayOfWeek(new Date(date));
  return new Date(monday.setDate(monday.getDate() + 6));
}

// Formatează data în format ISO (YYYY-MM-DD)
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Formatează data în format românesc (DD.MM.YYYY)
export function formatDateRO(dateStr: string): string {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Formatează data în format românesc cu nume lună (DD luna YYYY)
export function formatDateROWithMonth(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const months = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

// Returnează numele zilei în română
export function getDayName(dayOfWeek: number): string {
  const days = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];
  return days[dayOfWeek % 7];
}

// Returnează numele zilei în română (scurt)
export function getDayNameShort(dayOfWeek: number): string {
  const days = ['Dum', 'Luni', 'Marți', 'Mier', 'Joi', 'Vin', 'Sâm'];
  return days[dayOfWeek % 7];
}

// Generează array de 7 zile pentru o săptămână
export function generateWeekDays(mondayDate: Date): Array<{ dayOfWeek: number; date: string; displayName: string }> {
  const days = [];
  const monday = new Date(mondayDate);
  
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(monday);
    currentDate.setDate(monday.getDate() + i);
    
    days.push({
      dayOfWeek: i === 6 ? 0 : i + 1, // 1=Luni, 7=Duminică (0 pentru compatibilitate JS)
      date: formatDateISO(currentDate),
      displayName: getDayName(i === 6 ? 0 : i + 1)
    });
  }
  
  return days;
}
