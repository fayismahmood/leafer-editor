import { useEffect, useRef, useCallback } from 'react'
import {
  Leafer,
  Rect,
  Ellipse,
  Line,
  Text,
  Star,
  Box,
  type ILeafer,
  type IUI,
  type IDragEvent,
} from 'leafer-ui'
import { useStore } from '@tanstack/react-store'
import { editorStore, setLeafer, setSelectedElements } from '#/store/editor'
import { applyCanvas } from './editorCanvas'

function createSelectionBox() {
  return new Box({
    id: 'selection-box',
    stroke: '#4A90D9',
    strokeWidth: 1,
    dashPattern: [5, 5],
    fill: 'transparent',
    visible: false,
    editable: false,
    hitSelf: false,
    hitChildren: false,
    zIndex: 9999,
  })
}

export function LeaferCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
 
 useEffect(()=>{
    if(containerRef.current){
      applyCanvas(containerRef.current)
    }
 },[containerRef.current]) 
 

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-hidden bg-[#f0f0f0]"
      style={{ touchAction: 'none' }}
      
    />
  )
}
