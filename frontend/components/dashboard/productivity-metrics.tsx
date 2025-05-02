"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  {
    name: "Mon",
    "Time to Create": 45,
    "Words per Minute": 20,
    "Content Items": 2,
  },
  {
    name: "Tue",
    "Time to Create": 40,
    "Words per Minute": 24,
    "Content Items": 3,
  },
  {
    name: "Wed",
    "Time to Create": 30,
    "Words per Minute": 27,
    "Content Items": 4,
  },
  {
    name: "Thu",
    "Time to Create": 35,
    "Words per Minute": 25,
    "Content Items": 3,
  },
  {
    name: "Fri",
    "Time to Create": 25,
    "Words per Minute": 30,
    "Content Items": 5,
  },
  {
    name: "Sat",
    "Time to Create": 50,
    "Words per Minute": 18,
    "Content Items": 1,
  },
  {
    name: "Sun",
    "Time to Create": 42,
    "Words per Minute": 22,
    "Content Items": 2,
  },
]

export function ProductivityMetrics() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="Time to Create" stroke="#6366f1" activeDot={{ r: 8 }} />
        <Line yAxisId="left" type="monotone" dataKey="Words per Minute" stroke="#8b5cf6" />
        <Line yAxisId="right" type="monotone" dataKey="Content Items" stroke="#d946ef" />
      </LineChart>
    </ResponsiveContainer>
  )
}
