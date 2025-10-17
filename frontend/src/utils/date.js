export const formatThaiDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  // เพิ่มเวลาไทย +7 ชั่วโมง
  date.setHours(date.getHours() + 7);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy}`;
};
