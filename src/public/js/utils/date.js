export function timeAgo(dateParam) {
  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds} second(s) ago`;
  } else if (minutes < 60) {
    return `${minutes} minute(s) ago`;
  } else if (hours < 24) {
    return `${hours} hour(s) ago`;
  } else if (days < 7) {
    return `${days} day(s) ago`;
  }
}
