"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Check, ZoomIn, ZoomOut } from "lucide-react"

const CROP_SIZE = 240

interface Props {
  imageSrc: string
  onCrop: (blob: Blob) => void
  onClose: () => void
}

export default function AvatarCropModal({ imageSrc, onCrop, onClose }: Props) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const panRef = useRef({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 })

  // Keep panRef in sync with pan state so callbacks always have the latest value
  useEffect(() => { panRef.current = pan }, [pan])

  // clampPan — only uses refs and setPan; stable across renders
  const clampPan = useCallback((x: number, y: number, z: number) => {
    const img = imgRef.current
    if (!img || !img.naturalWidth) { setPan({ x, y }); return }
    const base = Math.min(CROP_SIZE / img.naturalWidth, CROP_SIZE / img.naturalHeight)
    const maxX = Math.max(0, (img.naturalWidth * base * z - CROP_SIZE) / 2)
    const maxY = Math.max(0, (img.naturalHeight * base * z - CROP_SIZE) / 2)
    setPan({ x: Math.max(-maxX, Math.min(maxX, x)), y: Math.max(-maxY, Math.min(maxY, y)) })
  }, [])

  // Re-clamp when zoom changes so image always covers the circle
  useEffect(() => {
    clampPan(panRef.current.x, panRef.current.y, zoom)
  }, [zoom, clampPan])

  const getDisplaySize = useCallback(() => {
    const img = imgRef.current
    if (!img || !img.naturalWidth) return { w: CROP_SIZE, h: CROP_SIZE }
    const base = Math.min(CROP_SIZE / img.naturalWidth, CROP_SIZE / img.naturalHeight)
    return { w: img.naturalWidth * base * zoom, h: img.naturalHeight * base * zoom }
  }, [zoom])

  // Mouse drag
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setDragging(true)
    dragStart.current = { mx: e.clientX, my: e.clientY, px: panRef.current.x, py: panRef.current.y }
  }

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging) return
    clampPan(
      dragStart.current.px + (e.clientX - dragStart.current.mx),
      dragStart.current.py + (e.clientY - dragStart.current.my),
      zoom,
    )
  }, [dragging, zoom, clampPan])

  const onMouseUp = useCallback(() => setDragging(false), [])

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [onMouseMove, onMouseUp])

  // Touch drag
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    dragStart.current = { mx: t.clientX, my: t.clientY, px: panRef.current.x, py: panRef.current.y }
  }
  const onTouchMove = (e: React.TouchEvent) => {
    const t = e.touches[0]
    clampPan(
      dragStart.current.px + (t.clientX - dragStart.current.mx),
      dragStart.current.py + (t.clientY - dragStart.current.my),
      zoom,
    )
  }

  // Export the cropped circle to a 300×300 JPEG blob
  const handleCrop = useCallback(() => {
    const img = imgRef.current
    if (!img || !img.naturalWidth) return
    const OUTPUT = 300
    const canvas = document.createElement("canvas")
    canvas.width = OUTPUT
    canvas.height = OUTPUT
    const ctx = canvas.getContext("2d")!

    ctx.beginPath()
    ctx.arc(OUTPUT / 2, OUTPUT / 2, OUTPUT / 2, 0, Math.PI * 2)
    ctx.clip()

    const base = Math.min(CROP_SIZE / img.naturalWidth, CROP_SIZE / img.naturalHeight)
    const displayW = img.naturalWidth * base * zoom
    const displayH = img.naturalHeight * base * zoom
    const imgLeft = (CROP_SIZE - displayW) / 2 + pan.x
    const imgTop = (CROP_SIZE - displayH) / 2 + pan.y

    const srcX = (0 - imgLeft) / (base * zoom)
    const srcY = (0 - imgTop) / (base * zoom)
    const srcW = CROP_SIZE / (base * zoom)
    const srcH = CROP_SIZE / (base * zoom)

    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, OUTPUT, OUTPUT)
    canvas.toBlob((blob) => { if (blob) onCrop(blob) }, "image/jpeg", 0.92)
  }, [zoom, pan, onCrop])

  const { w: imgW, h: imgH } = getDisplaySize()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-zinc-900 border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-5 shadow-2xl w-full max-w-sm"
      >
        <div className="flex items-center justify-between w-full">
          <h3 className="text-lg font-semibold text-white">Crop Avatar</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center -mt-2">
          Drag to reposition · use the slider to zoom
        </p>

        {/* Crop circle viewport */}
        <div
          className="relative overflow-hidden rounded-full border-2 border-orange-500/60 shadow-lg shadow-orange-500/20 cursor-grab active:cursor-grabbing select-none"
          style={{ width: CROP_SIZE, height: CROP_SIZE }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
        >
          {/* Crosshair guides */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10" />
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Crop preview"
            draggable={false}
            onLoad={() => { setZoom(1); setPan({ x: 0, y: 0 }) }}
            style={{
              position: "absolute",
              width: imgW,
              height: imgH,
              left: (CROP_SIZE - imgW) / 2 + pan.x,
              top: (CROP_SIZE - imgH) / 2 + pan.y,
              userSelect: "none",
              pointerEvents: "none",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Zoom slider */}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() => setZoom((z) => Math.max(1, +(z - 0.1).toFixed(1)))}
            className="text-gray-400 hover:text-orange-400 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-orange-500 cursor-pointer"
          />
          <button
            onClick={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(1)))}
            className="text-gray-400 hover:text-orange-400 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-zinc-700 text-gray-400 hover:bg-zinc-800 hover:text-white transition-all text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleCrop}
            className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Check className="w-4 h-4" />
            Crop &amp; Upload
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
