export const getTime = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Günaydın ☀️";
  if (hour >= 12 && hour < 17) return "Tünaydın ☕";
  if (hour >= 17 && hour < 22) return "İyi Akşamlar 🌙";
  return "İyi Geceler 🦉";
};
