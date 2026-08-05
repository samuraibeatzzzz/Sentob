export function calculateNights(checkIn: string, checkOut: string): number {
  const inDate = new Date(`${checkIn}T00:00:00Z`);
  const outDate = new Date(`${checkOut}T00:00:00Z`);
  const ms = outDate.getTime() - inDate.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function calculateTotalPrice(params: {
  pricePerNight: number;
  checkIn: string;
  checkOut: string;
  rooms: number;
}): { nights: number; totalPrice: number } {
  const nights = calculateNights(params.checkIn, params.checkOut);
  const totalPrice = Math.round(params.pricePerNight * nights * params.rooms);
  return { nights, totalPrice };
}
