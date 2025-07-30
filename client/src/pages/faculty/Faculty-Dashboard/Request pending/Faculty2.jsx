import { AwaitingApprovals } from "./ApprovalPending"

export default function Faculty2() {
  return (
    <div className="p-2 md:p-4 bg-white w-full shadow rounded-lg h-full">
        <AwaitingApprovals />
    </div>
  )
}