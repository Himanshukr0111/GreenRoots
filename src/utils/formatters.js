/**
 * Formats a number into Indian Rupee (INR) currency representation.
 * Example: 40 -> ₹40, 1250 -> ₹1,250
 */
export const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}
