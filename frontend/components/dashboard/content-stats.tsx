"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveLine } from "@nivo/line"
import { motion } from "framer-motion"

interface ContentStatsProps {
  className?: string
}

export function ContentStats({ className }: ContentStatsProps) {
  // Example data for the chart
  const data = [
    {
      id: "Blog Posts",
      color: "hsl(244, 100%, 75%)",
      data: [
        { x: "Jan", y: 4 },
        { x: "Feb", y: 3 },
        { x: "Mar", y: 5 },
        { x: "Apr", y: 6 },
        { x: "May", y: 8 },
        { x: "Jun", y: 14 },
      ],
    },
    {
      id: "Social Media",
      color: "hsl(217, 100%, 75%)",
      data: [
        { x: "Jan", y: 10 },
        { x: "Feb", y: 12 },
        { x: "Mar", y: 15 },
        { x: "Apr", y: 18 },
        { x: "May", y: 22 },
        { x: "Jun", y: 32 },
      ],
    },
    {
      id: "Emails",
      color: "hsl(288, 100%, 75%)",
      data: [
        { x: "Jan", y: 2 },
        { x: "Feb", y: 3 },
        { x: "Mar", y: 2 },
        { x: "Apr", y: 4 },
        { x: "May", y: 5 },
        { x: "Jun", y: 7 },
      ],
    },
  ]

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Content Creation Stats</CardTitle>
          <CardDescription>Your content creation activity over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveLine
              data={data}
              margin={{ top: 10, right: 20, bottom: 40, left: 40 }}
              xScale={{ type: "point" }}
              yScale={{
                type: "linear",
                min: "auto",
                max: "auto",
                stacked: false,
              }}
              curve="monotoneX"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
              }}
              enableGridX={false}
              colors={{ scheme: "category10" }}
              lineWidth={3}
              pointSize={8}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              enablePointLabel={false}
              useMesh={true}
              legends={[
                {
                  anchor: "top",
                  direction: "row",
                  justify: false,
                  translateX: 0,
                  translateY: -20,
                  itemsSpacing: 10,
                  itemDirection: "left-to-right",
                  itemWidth: 80,
                  itemHeight: 20,
                  symbolSize: 12,
                  symbolShape: "circle",
                },
              ]}
              theme={{
                axis: {
                  ticks: {
                    text: {
                      fontSize: 12,
                      fill: "#888888",
                    },
                  },
                },
                grid: {
                  line: {
                    stroke: "#dddddd",
                    strokeWidth: 1,
                  },
                },
                legends: {
                  text: {
                    fontSize: 12,
                  },
                },
                tooltip: {
                  container: {
                    fontSize: "12px",
                  },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
