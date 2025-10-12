import { verifyWebhook } from "@clerk/nextjs/webhooks";

import { NextRequest, NextResponse } from "next/server";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.action";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    // Handle different event types
    const { id } = evt.data;
    const eventType = evt.type;

    // Handle specific events
    if (eventType === "user.created") {
      const {
        id,
        email_addresses,
        username,
        first_name,
        last_name,
        image_url,
      } = evt.data;

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
      const {
        id,
        email_addresses,
        username,
        first_name,
        last_name,
        image_url,
      } = evt.data;

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
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
