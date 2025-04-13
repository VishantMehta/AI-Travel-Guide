import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-4">
      <Loader2 className="h-8 w-8 text-teal-600 animate-spin mb-4" />
      <p className="text-slate-600">Loading travel experiences...</p>
    </div>
  )
}
