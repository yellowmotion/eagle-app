import Connection from "@/components/Connection";
import { DashboardData } from "@/components/DashboardData";
import { DashboardContextContent } from "@/lib/mqtt";

export default function DashboardPage() {

  const ctx: DashboardContextContent = {
    client: null,
    primary_proto_file: null,
    primary_proto_root: null,
    secondary_proto_file: null,
    secondary_proto_root: null
  }

  return (
    <DashboardData/>
  );
}
