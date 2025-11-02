'use client'

// We need these components from the Recharts library
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// 1. Define the type for the data we're getting from the page
type TimeAnalyticsData = {
  category_name: string
  total_seconds: number
  category_color: string
}

type TimeChartProps = {
  data: TimeAnalyticsData[]
}

// 2. The component takes our data as a prop
export default function TimeChart({ data }: TimeChartProps) {
  // Helper to convert seconds to a "HH:MM" string
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  // 3. Recharts needs the 'value' to be a number.
  // We'll also format the name.
  const chartData = data.map((item) => ({
    name: `${item.category_name} (${formatTime(item.total_seconds)})`,
    value: item.total_seconds,
    color: item.category_color,
  }))

  return (
    // ResponsiveContainer makes the chart fill its parent div
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value" // The 'value' is what determines the slice size
          nameKey="name"   // The 'name' is what shows up in the legend
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          labelLine={false}
        >
          {/* This maps over our data to set the color for each slice */}
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}