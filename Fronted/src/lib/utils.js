export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// Turns a Cloudinary image URL into one that forces a real download instead
// of opening in a new tab — Cloudinary's fl_attachment flag makes it send
// the file with Content-Disposition: attachment.
export function getDownloadUrl(cloudinaryUrl) {
  if (!cloudinaryUrl?.includes("/upload/")) return cloudinaryUrl;
  return cloudinaryUrl.replace("/upload/", "/upload/fl_attachment/");
}

export function formatLastSeen(date) {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  return `${diffDay}d ago`;
}
