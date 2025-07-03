import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function AgentDashboardPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Button asChild>
          <Link href="/agent/listings/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Listing
          </Link>
        </Button>
      </div>
      {/* We will list the agent's properties here later */}
      <div className="border-2 border-dashed rounded-lg p-12 text-center">
        <p className="text-muted-foreground">You have not added any listings yet.</p>
      </div>
    </div>
  );
}
