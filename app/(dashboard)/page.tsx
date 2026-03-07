import { Header } from '@/components/layout/header'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <Header title="Dashboard" subtitle="Overview of your AI generation activity" />
      <DashboardContent />
    </div>
  )
}
