interface LexicalNode {
  text?: string
  children?: LexicalNode[]
  type?: string
  root?: LexicalNode
}

export const lexicalToText = (node: LexicalNode | string | null | undefined): string => {
  if (!node) return ''
  if (typeof node === 'string') return node

  // Extract text from text nodes
  if (node.text) {
    return node.text
  }

  // Handle nodes with children (root, paragraph, list, etc.)
  if (Array.isArray(node.children)) {
    const text = node.children.map((child) => lexicalToText(child)).join('')

    // Add newlines for block-level elements to preserve structure in textarea
    if (node.type === 'paragraph' || node.type === 'listitem') {
      return text + '\n'
    }
    return text
  }

  // Handle the top-level root node
  if (node.root) {
    return lexicalToText(node.root).trim()
  }

  return ''
}
