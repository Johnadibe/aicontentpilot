"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  {
    name: "Monday",
    "Content Items": 5,
  },
  {
    name: "Tuesday",
    "Content Items": 7,
  },
  {
    name: "Wednesday",
    "Content Items": 8,
  },
  {
    name: "Thursday",
    "Content Items": 6,
  },
  {
    name: "Friday",
    "Content Items": 4,
  },
  {
    name: "Saturday",
    "Content Items": 2,
  },
  {
    name: "Sunday",
    "Content Items": 1,
  },
]

export function CreationFrequency() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Content Items" fill="#6366f1" />
      </BarChart>
    </ResponsiveContainer>
  )
}
