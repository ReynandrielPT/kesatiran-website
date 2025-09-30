import { NextResponse } from "next/server";
import works from "@/data/works.json";

export async function GET() {
  return NextResponse.json(works);
}
