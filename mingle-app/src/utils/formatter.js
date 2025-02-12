export function formatDate(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return "just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else if (diffDays === 1) {
    return "Yesterday";
  } else {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" }); // Month name
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }
}

// export function formatCount(cnt) {
//     cnt = Number(cnt);
//     if(cnt < 1000)
//       return cnt;
//     else if(cnt >= 1000 && cnt < (1000 * 1000))
//       return (cnt / 1000).toFixed(2) + "k";
//     else
//       return (cnt / (1000 * 1000)).toFixed(2) + " M"
// }

export function formatCount(cnt) {

  const formatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

  if (cnt < 1000) return cnt.toString();
  if (cnt < 1_000_000) return formatter.format(cnt / 1000) + 'k';
  if (cnt < 1_000_000_000) return formatter.format(cnt / 1_000_000) + 'M';

  return formatter.format(cnt / 1_000_000_000).replace(/\.00$/, '') + 'B'; // Handle billions
}


export function getFullDate(dateStr) {
  const date = new Date(dateStr);

  const hours = date.getHours() % 12 || 12; 
  const amPm = date.getHours() >= 12 ? 'PM' : 'AM';

  const minutes = String(date.getMinutes()).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = String(date.getFullYear()).slice(-2);

  return `${hours}:${minutes} ${amPm} ${day}/${month}/${year}`;
}