'use client'

import { connect } from "@/lib/mqtt"
import { ReactNode } from "react"
import { DashboardContextContent } from "./DashboardContext"

type ConnectionProps = {
  // callback: (network: string, message: {[k: string]: any}) => void,
  children: ReactNode 
}

export default function Connection({ children }: ConnectionProps) {
  
  const ctx: DashboardContextContent = {
    client: null,
    primary_proto_file: null,
    primary_proto_root: null,
    secondary_proto_file: null,
    secondary_proto_root: null
  }
  
  connect(ctx, console.log)

  return children
}
