"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { CreateTeamDialog } from "@/components/teams/create-team-dialog"

export function CreateTeamButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        New Team
      </Button>
      <CreateTeamDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  )
}
