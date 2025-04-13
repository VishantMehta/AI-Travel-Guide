import type { ReactNode } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-white overflow-hidden group">
      <div className="absolute h-1 w-full bg-gradient-to-r from-teal-500 to-emerald-500 top-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-teal-50 transition-colors duration-300">{icon}</div>
        <h3 className="font-bold text-xl text-slate-800">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600">{description}</p>
      </CardContent>
    </Card>
  )
}
