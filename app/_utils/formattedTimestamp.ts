export function formattedTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  // Format the date in Indonesian locale
  const formattedDate = date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Format the time in Indonesian locale (24-hour clock)
  const formattedTime = date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // Return the combined formatted date and time
  return `${formattedDate} pukul ${formattedTime}`;
}
