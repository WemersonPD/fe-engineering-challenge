import Button from '../atoms/Button'
import Text from '../atoms/Text'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="gray"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
      >
        Previous
      </Button>

      <Text variant="inter-light" className="text-gray-600">
        Page {page + 1} of {totalPages}
      </Text>

      <Button
        variant="gray"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
      >
        Next
      </Button>
    </div>
  )
}

export default Pagination
