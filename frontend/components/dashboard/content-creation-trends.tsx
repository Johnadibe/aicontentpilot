"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  {
    name: "Jan",
    "Blog Posts": 4,
    "Social Media": 12,
    "Email Copy": 2,
    Images: 5,
  },
  {
    name: "Feb",
    "Blog Posts": 3,
    "Social Media": 10,
    "Email Copy": 3,
    Images: 7,
  },
  {
    name: "Mar",
    "Blog Posts": 5,
    "Social Media": 15,
    "Email Copy": 2,
    Images: 8,
  },
  {
    name: "Apr",
    "Blog Posts": 6,
    "Social Media": 18,
    "Email Copy": 4,
    Images: 10,
  },
  {
    name: "May",
    "Blog Posts": 4,
    "Social Media": 14,
    "Email Copy": 3,
    Images: 6,
  },
]

export function ContentCreationTrends() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Blog Posts" stroke="#6366f1" />
        <Line type="monotone" dataKey="Social Media" stroke="#8b5cf6" />
        <Line type="monotone" dataKey="Email Copy" stroke="#d946ef" />
        <Line type="monotone" dataKey="Images" stroke="#ec4899" />
      </LineChart>
    </ResponsiveContainer>
  )
}
