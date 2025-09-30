import { NextResponse } from "next/server";
import members from "@/data/members.json";

export async function GET() {
  return NextResponse.json(members);
}
