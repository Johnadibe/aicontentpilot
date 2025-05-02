"use client"

import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { PlusCircle, CheckCircle } from "lucide-react"

const goals = [
  {
    id: "goal1",
    name: "Weekly blog posts",
    target: 4,
    current: 3,
    percentage: 75,
    dueDate: "May 7, 2023",
    status: "in-progress",
  },
  {
    id: "goal2",
    name: "Social media content",
    target: 10,
    current: 8,
    percentage: 80,
    dueDate: "May 10, 2023",
    status: "in-progress",
  },
  {
    id: "goal3",
    name: "Email newsletters",
    target: 2,
    current: 2,
    percentage: 100,
    dueDate: "May 5, 2023",
    status: "completed",
  },
  {
    id: "goal4",
    name: "Product descriptions",
    target: 5,
    current: 2,
    percentage: 40,
    dueDate: "May 15, 2023",
    status: "in-progress",
  },
]

export function GoalTracking() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Current Goals</h3>
        <Button size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{goal.name}</h4>
                <p className="text-sm text-muted-foreground">Due: {goal.dueDate}</p>
              </div>
              <div className="flex items-center">
                {goal.status === "completed" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <span className="text-sm font-medium">
                    {goal.current}/{goal.target}
                  </span>
                )}
              </div>
            </div>

            <Progress value={goal.percentage} className="h-2 mb-2" />

            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-muted-foreground">{goal.percentage}% complete</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Update
                </Button>
                {goal.status !== "completed" && (
                  <Button variant="outline" size="sm" className="text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
