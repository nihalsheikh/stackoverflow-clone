// app/api/webhooks/clerk/route.ts
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";

import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.action";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET to .env");
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", { status: 400 });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error: Verification failed", { status: 400 });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, username, first_name, last_name, image_url } =
      evt.data;

    // Create user in your database here
    const mongoUser = await createUser({
      clerkId: id,
      name: `${first_name}${last_name ? ` ${last_name}` : ""}`,
      username: username!,
      email: email_addresses[0].email_address,
      picture: image_url,
    });

    return NextResponse.json({ message: "OK", user: mongoUser });
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, username, first_name, last_name, image_url } =
      evt.data;

    // Update user in your database here
    const mongoUser = await updateUser({
      clerkId: id,
      updateData: {
        name: `${first_name}${last_name ? ` ${last_name}` : ""}`,
        username: username!,
        email: email_addresses[0].email_address,
        pictureUrl: image_url,
      },
      path: `/profile/${id}`,
    });

    return NextResponse.json({ message: "OK", user: mongoUser });
  }

  if (eventType === "user.deleted") {
    // Delete user from your database here
    const { id } = evt.data;

    const deletedUser = await deleteUser({
      clerkId: id!,
    });

    return NextResponse.json({ message: "OK", user: deletedUser });
  }

  return new Response("Webhook received", { status: 200 });
}
