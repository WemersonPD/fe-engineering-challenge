import { generateUniqueCode } from './code'
import { toLocalDateString } from './date'

interface ExportCSVDataReturn {
  success: boolean
  error?: string
}

function sanitizeFilename(filename: string): string {
  const [prefixWithoutExtension] = filename.split('.')
  const timestamp = toLocalDateString(new Date())
    .replaceAll('/', '-')
    .replaceAll(' ', '_')
    .replaceAll(':', '-')
  const uniqueCode = generateUniqueCode()

  return `${prefixWithoutExtension}_${timestamp}_${uniqueCode}.csv`
}

const downloadCsv = (csv: string, filename: string) => {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(
    new Blob([csv], { type: 'text/csv;charset=utf-8;' }),
  )
  a.download = sanitizeFilename(filename)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(a.href)
}

export const exportCSV = (
  data: Record<string, string | number>[],
  filename: string,
): ExportCSVDataReturn => {
  if (data.length === 0) {
    return { success: false, error: 'No data to export' }
  }

  const headers = Object.keys(data[0])
  const rows = data.map((row) => Object.values(row).join(','))
  const csv = [headers.join(','), ...rows].join('\n')

  downloadCsv(csv, filename)

  return { success: true }
}
