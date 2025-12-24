export function formatPrice(num){
  if(typeof num !== 'number') return num
  // Group digits every 3 with comma, then append تومان
  return num.toLocaleString('en-US') + ' تومان'
}

export function isPriceHigh(num){
  return typeof num === 'number' && num >= 600000
}
