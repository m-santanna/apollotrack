import { useCallback, useRef, useState } from 'react'
import { useSetAtom } from 'jotai/react'
import { Upload, Camera, FileText, X } from 'lucide-react'
import { scanErrorAtom, scanLoadingAtom, scanResultAtom, scanResultDialogAtom } from '@/lib/atoms'
import { analyzeFood } from '@/lib/server/analyze-food'
import ScanningState from './scanning-state'

const ACCEPTED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
    'application/pdf',
]
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export default function UploadCard() {
    const [isDragging, setIsDragging] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const setScanResult = useSetAtom(scanResultAtom)
    const setScanLoading = useSetAtom(scanLoadingAtom)
    const setScanError = useSetAtom(scanErrorAtom)
    const setScanResultDialog = useSetAtom(scanResultDialogAtom)

    const handleFile = useCallback(
        async (file: File) => {
            // Validate type
            if (!ACCEPTED_TYPES.includes(file.type)) {
                setScanError('Unsupported file type. Please use JPG, PNG, WebP, HEIC, or PDF.')
                return
            }

            // Validate size
            if (file.size > MAX_SIZE) {
                setScanError('File too large. Maximum size is 10MB.')
                return
            }

            // Show preview for images
            if (file.type.startsWith('image/')) {
                const url = URL.createObjectURL(file)
                setPreview(url)
            } else {
                setPreview(null)
            }

            // Convert to base64
            const reader = new FileReader()
            reader.onload = async () => {
                const base64 = (reader.result as string).split(',')[1]
                setScanLoading(true)
                setScanError(null)

                try {
                    const result = await analyzeFood({
                        data: { base64, mimeType: file.type },
                    })
                    if (result.success) {
                        setScanResult(result.data)
                        setScanResultDialog(true)
                    }
                } catch (error) {
                    setScanError(
                        error instanceof Error
                            ? error.message
                            : 'Something went wrong. Please try again.',
                    )
                } finally {
                    setScanLoading(false)
                    setPreview(null)
                }
            }
            reader.readAsDataURL(file)
        },
        [setScanResult, setScanLoading, setScanError, setScanResultDialog],
    )

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setIsDragging(false)
            const file = e.dataTransfer.files[0]
            if (file) handleFile(file)
        },
        [handleFile],
    )

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
            // Reset so the same file can be selected again
            e.target.value = ''
        },
        [handleFile],
    )

    return (
        <div className="w-full">
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                    Scan Food
                </h2>
                <p className="text-sm text-muted-foreground">
                    Take a photo of a nutrition label or food item and let AI
                    extract the macros for you.
                </p>
            </div>

            <ScanningState />

            {preview && (
                <div className="relative mb-4 overflow-hidden rounded-xl">
                    <img
                        src={preview}
                        alt="Preview"
                        className="h-48 w-full object-cover"
                    />
                    <button
                        onClick={() => setPreview(null)}
                        className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black/70"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`group relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
                    isDragging
                        ? 'border-primary bg-primary/5 scale-[1.01]'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_TYPES.join(',')}
                    onChange={handleInputChange}
                    className="hidden"
                />

                <div className="flex flex-col items-center gap-3">
                    <div
                        className={`rounded-xl p-3 transition-colors ${
                            isDragging
                                ? 'bg-primary/10 text-primary'
                                : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                        }`}
                    >
                        <Upload className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-foreground">
                            Drop your image here, or{' '}
                            <span className="text-primary">browse</span>
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            JPG, PNG, WebP, HEIC, or PDF up to 10MB
                        </p>
                    </div>
                    <div className="flex items-center gap-4 pt-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Camera className="h-3.5 w-3.5" />
                            <span>Photo</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <FileText className="h-3.5 w-3.5" />
                            <span>Label</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
