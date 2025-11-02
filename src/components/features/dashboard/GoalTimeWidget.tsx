'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

// 1. Define the type for the data we're getting from the SQL function
type GoalAnalyticsData = {
  parent_category_name: string
  total_seconds_logged: number
  average_goal_progress: number
}

type GoalTimeWidgetProps = {
  data: GoalAnalyticsData[]
}

// 2. The component takes our data as a prop
export default function GoalTimeWidget({ data }: GoalTimeWidgetProps) {
  // 3. We re-format the data to be more chart-friendly
  const chartData = data.map((item) => ({
    // Use the category name for the X-axis
    name: item.parent_category_name,

    // Convert logged seconds into hours
    'Time (Hours)': parseFloat(
      (item.total_seconds_logged / 3600).toFixed(2)
    ),

    // Use the goal progress % as-is (it's already 0-100)
    'Progress (%)': parseFloat(
      Number(item.average_goal_progress).toFixed(2)
    ),
  }))

  return (
    // ResponsiveContainer makes the chart fill its parent div
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{
          top: 5,
          right: 20, // Make space for Y-axis label
          left: 20, // Make space for Y-axis label
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#555" />
        <XAxis dataKey="name" stroke="#ccc" />

        {/* Y-Axis for Progress (0-100%) */}
        <YAxis
          yAxisId="progress" // Give it an ID
          orientation="left"
          stroke="#8884d8"
          label={{
            value: 'Progress (%)',
            angle: -90,
            position: 'insideLeft',
            fill: '#ccc',
          }}
          domain={[0, 100]} // Lock the scale from 0 to 100
        />

        {/* Y-Axis for Time (Hours) */}
        <YAxis
          yAxisId="time" // Give it a different ID
          orientation="right"
          stroke="#82ca9d"
          label={{
            value: 'Time (Hours)',
            angle: 90,
            position: 'insideRight',
            fill: '#ccc',
          }}
        />

        <Tooltip
          contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
        />
        <Legend />

        {/* Bar for Progress, linked to the "progress" Y-axis */}
        <Bar
          yAxisId="progress"
          dataKey="Progress (%)"
          fill="#8884d8"
        />

        {/* Bar for Time, linked to the "time" Y-axis */}
        <Bar yAxisId="time" dataKey="Time (Hours)" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  )
}