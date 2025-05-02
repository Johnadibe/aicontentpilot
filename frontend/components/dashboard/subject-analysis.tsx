"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

const data = [
  {
    subject: "Marketing",
    value: 80,
    fullMark: 100,
  },
  {
    subject: "Technology",
    value: 65,
    fullMark: 100,
  },
  {
    subject: "Business",
    value: 70,
    fullMark: 100,
  },
  {
    subject: "Education",
    value: 45,
    fullMark: 100,
  },
  {
    subject: "Health",
    value: 30,
    fullMark: 100,
  },
  {
    subject: "Finance",
    value: 55,
    fullMark: 100,
  },
]

export function SubjectAnalysis() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis />
        <Radar name="Topics" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  )
}
