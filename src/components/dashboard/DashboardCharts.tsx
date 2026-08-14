import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { DashboardMetrics } from '../../hooks/useDashboardMetrics'

interface ContentDistributionChartProps {
  data: DashboardMetrics
}

export function ContentDistributionChart({ data }: ContentDistributionChartProps) {
  const chartData = Object.entries(data.itemsByType).map(([type, count]) => ({
    name: type.replace('Requests', '').replace('Ministries', 'Min.'),
    value: count,
  }))

  const COLORS = ['#3b82f6', '#a855f7', '#f59e0b', '#ec4899', '#10b981']

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg bg-stone-50">
        <p className="text-stone-500">No data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: ${value}`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

interface ContentStatusChartProps {
  published: number
  draft: number
  archived: number
}

export function ContentStatusChart({ published, draft, archived }: ContentStatusChartProps) {
  const chartData = [
    { name: 'Published', value: published, fill: '#10b981' },
    { name: 'Draft', value: draft, fill: '#f59e0b' },
    { name: 'Archived', value: archived, fill: '#6b7280' },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

interface ActivityTrendChartProps {
  data: Array<{ date: string; count: number }>
}

export function ActivityTrendChart({ data }: ActivityTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg bg-stone-50">
        <p className="text-stone-500">No activity data</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 4 }}
          activeDot={{ r: 6 }}
          name="New Items"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
