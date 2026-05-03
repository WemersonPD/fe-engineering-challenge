export const generateUniqueCode = (size: number = 8): string => {
  const generatedDigits = String(Math.random()).substring(2)

  const charIndex = Math.min(size, generatedDigits.length)
  return generatedDigits.substring(0, charIndex)
}
