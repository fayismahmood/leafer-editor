export function figmaToLeafer(figmaJson: any): any {
  const result: any = {
    tag: 'Leafer',
    children: [],
  }

  if (!figmaJson?.document) return result

  function processNode(node: any, parent: any): any {
    if (!node) return null

    const leaferNode: any = {
      tag: mapFigmaTypeToTag(node.type),
      name: node.name,
    }

    if (node.children) {
      leaferNode.children = []
    }

    if (node.absoluteBoundingBox) {
      const box = node.absoluteBoundingBox
      leaferNode.x = box.x
      leaferNode.y = box.y
      leaferNode.width = box.width
      leaferNode.height = box.height
    }

    if (node.fills && node.fills.length > 0) {
      const fill = node.fills[0]
      if (fill.type === 'SOLID' && fill.color) {
        leaferNode.fill = rgbToHex(fill.color)
      }
    }

    if (node.stroke && node.stroke.length > 0) {
      const stroke = node.stroke[0]
      if (stroke.type === 'SOLID' && stroke.color) {
        leaferNode.stroke = rgbToHex(stroke.color)
      }
    }

    if (node.strokeWeight !== undefined) {
      leaferNode.strokeWidth = node.strokeWeight
    }

    if (node.opacity !== undefined && node.opacity < 1) {
      leaferNode.opacity = node.opacity
    }

    if (node.cornerRadius !== undefined && node.cornerRadius > 0) {
      leaferNode.cornerRadius = node.cornerRadius
    }

    if (node.type === 'TEXT' && node.style) {
      if (node.style.fontSize) leaferNode.fontSize = node.style.fontSize
      if (node.style.fontFamily) leaferNode.fontFamily = node.style.fontFamily
      if (node.style.fontWeight) leaferNode.fontWeight = node.style.fontWeight
      if (node.style.textAlignHorizontal) {
        leaferNode.textAlign = node.style.textAlignHorizontal.toLowerCase()
      }
      leaferNode.text = node.characters || ''
    }

    if (node.type === 'LINE' && node.strokeAlign) {
      leaferNode.strokeAlign = node.strokeAlign.toLowerCase()
    }

    if (node.type === 'VECTOR' && node.path) {
      leaferNode.path = node.path
    }

    if (parent) {
      parent.children = parent.children || []
      parent.children.push(leaferNode)
    }

    if (node.children) {
      for (const child of node.children) {
        processNode(child, leaferNode)
      }
    }

    return leaferNode
  }

  function mapFigmaTypeToTag(type: string): string {
    const typeMap: Record<string, string> = {
      DOCUMENT: 'Leafer',
      CANVAS: 'Frame',
      FRAME: 'Frame',
      GROUP: 'Group',
      RECTANGLE: 'Rect',
      ELLIPSE: 'Ellipse',
      LINE: 'Line',
      TEXT: 'Text',
      VECTOR: 'Path',
      BOOLEAN_OPERATION: 'Group',
      STAR: 'Star',
      REGULAR_POLYGON: 'Rect',
      SLICE: 'Rect',
      COMPONENT: 'Frame',
      COMPONENT_SET: 'Frame',
      INSTANCE: 'Frame',
    }
    return typeMap[type] || 'Rect'
  }

  function rgbToHex(color: { r: number; g: number; b: number }): string {
    const r = Math.round((color.r || 0) * 255)
    const g = Math.round((color.g || 0) * 255)
    const b = Math.round((color.b || 0) * 255)
    const hex = ((r << 16) | (g << 8) | b).toString(16)
    return '#' + hex.padStart(6, '0')
  }

  const doc = figmaJson.document
  if (doc.children) {
    for (const child of doc.children) {
      processNode(child, result)
    }
  }

  return result
}