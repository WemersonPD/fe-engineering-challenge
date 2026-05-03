interface ShareResult {
  success: boolean
  message: string
}

async function copyToClipboard(url: string): Promise<ShareResult> {
  try {
    await navigator.clipboard.writeText(url)
    return { success: true, message: '' }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to share'
    return { success: false, message }
  }
}

export async function sharePokemon(
  id: number,
  name: string,
): Promise<ShareResult> {
  const url = `${window.location.origin}/pokemon/${id}`

  try {
    await navigator.share({
      title: name,
      text: `\nI am sharing ${name} with you! Check it out:`,
      url,
    })

    return { success: true, message: '' }
  } catch {
    return copyToClipboard(url)
  }
}
