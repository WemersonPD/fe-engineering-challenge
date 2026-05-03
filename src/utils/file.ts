import { generateUniqueCode } from './code'
import { toLocalDateString } from './date'

interface ExportCSVDataReturn {
  success: boolean
  error?: string
}

interface ImportCSVDataReturn {
  success: boolean
  data?: Record<string, string>[]
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

export const importCSV = (file: File): Promise<ImportCSVDataReturn> => {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const text = e.target?.result as string
      if (!text) {
        resolve({ success: false, error: 'Failed to read file' })
        return
      }

      const lines = text.trim().split('\n')
      if (lines.length < 2) {
        resolve({ success: false, error: 'No data rows found' })
        return
      }

      const headers = lines[0].split(',')
      const rows = lines.slice(1)
      const data = rows.map((row) => {
        const values = row.split(',')

        return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']))
      })

      resolve({ success: true, data })
    }

    reader.onerror = () => {
      resolve({ success: false, error: 'Failed to read file' })
    }

    reader.readAsText(file)
  })
}
