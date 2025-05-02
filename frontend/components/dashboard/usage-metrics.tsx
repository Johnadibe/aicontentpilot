"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  {
    name: "Week 1",
    "Words Generated": 5000,
    "Images Created": 3,
    "API Calls": 45,
  },
  {
    name: "Week 2",
    "Words Generated": 7500,
    "Images Created": 2,
    "API Calls": 38,
  },
  {
    name: "Week 3",
    "Words Generated": 6200,
    "Images Created": 1,
    "API Calls": 32,
  },
  {
    name: "Week 4",
    "Words Generated": 5800,
    "Images Created": 2,
    "API Calls": 41,
  },
]

export function UsageMetrics() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="Words Generated" fill="#6366f1" />
        <Bar yAxisId="right" dataKey="Images Created" fill="#8b5cf6" />
        <Bar yAxisId="right" dataKey="API Calls" fill="#d946ef" />
      </BarChart>
    </ResponsiveContainer>
  )
}
