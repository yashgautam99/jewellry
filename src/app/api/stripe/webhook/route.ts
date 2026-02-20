import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Stripe webhook handler stub
  const body = await request.text();
  console.log("Stripe webhook received");
  return NextResponse.json({ received: true });
}
