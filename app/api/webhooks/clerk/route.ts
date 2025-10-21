// app/api/webhooks/clerk/route.ts
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";

import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.action";

import config from "@/config/config";

export async function POST(req: Request) {
  try {
    const WEBHOOK_SECRET = config.clerkWebhookSigningSecret;

    if (!WEBHOOK_SECRET) {
      console.error("❌ CLERK_WEBHOOK_SIGNING_SECRET is missing");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 },
      );
    }

    console.log("Webhook received");

    // Get headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error("Missing svix headers");
      return NextResponse.json(
        { error: "Missing svix headers" },
        { status: 400 },
      );
    }

    // Get body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    console.log("📦 Payload received:", payload.type);

    // Verify webhook
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
      console.log("Webhook verified successfully");
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return NextResponse.json(
        { error: "Verification failed" },
        { status: 400 },
      );
    }

    // Handle the webhook
    const eventType = evt.type;
    console.log("🎯 Event type:", eventType);

    if (eventType === "user.created") {
      const {
        id,
        email_addresses,
        username,
        first_name,
        last_name,
        image_url,
      } = evt.data;

      console.log("👤 Creating user with clerkId:", id);
      console.log("📧 Email:", email_addresses[0].email_address);
      console.log("👨 Name:", first_name, last_name);
      console.log("🏷️ Username:", username);

      try {
        // Create user in your database here
        const mongoUser = await createUser({
          clerkId: id,
          name: `${first_name || ""}${last_name ? ` ${last_name}` : ""}`.trim(),
          username: username || email_addresses[0].email_address.split("@")[0],
          email: email_addresses[0].email_address,
          picture: image_url,
        });

        console.log("✅ User created successfully with ID:", mongoUser?._id);

        return NextResponse.json({
          message: "User created",
          user: { id: mongoUser?._id, clerkId: mongoUser?.clerkId },
        });
      } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
          { message: "Error creating user", error: String(error) },
          { status: 500 },
        );
      }
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

      console.log("👤 Updating user with clerkId:", id);
      console.log("📝 New name:", first_name, last_name);
      console.log("🏷️ New username:", username);

      try {
        // Update user in your database here
        const mongoUser = await updateUser({
          clerkId: id,
          updateData: {
            name: `${first_name || ""}${last_name ? ` ${last_name}` : ""}`.trim(),
            username: username!,
            email: email_addresses[0].email_address,
            pictureUrl: image_url,
          },
          path: `/profile/${id}`,
        });

        if (!mongoUser) {
          console.log("⚠️ User not found in MongoDB, creating now...");
          // Create the user if they don't exist (fallback)
          const newUser = await createUser({
            clerkId: id,
            name:
              `${first_name || ""}${last_name ? ` ${last_name}` : ""}`.trim() ||
              "User",
            username:
              username || email_addresses[0].email_address.split("@")[0],
            email: email_addresses[0].email_address,
            picture: image_url,
          });
          console.log("✅ User created (was missing) with ID:", newUser?._id);
          return NextResponse.json({
            message: "User created (was missing)",
            user: { id: newUser?._id, clerkId: newUser?.clerkId },
          });
        }

        console.log("✅ User updated successfully:", mongoUser);

        return NextResponse.json({
          message: "User updated",
          user: { id: mongoUser._id, clerkId: mongoUser.clerkId },
        });
      } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
          { message: "Error updating user", error: String(error) },
          { status: 500 },
        );
      }
    }

    if (eventType === "user.deleted") {
      // Delete user from your database here
      const { id } = evt.data;

      console.log("🗑️ Deleting user:", id);

      try {
        const deletedUser = await deleteUser({
          clerkId: id!,
        });

        console.log("✅ User deleted successfully:", deletedUser);

        return NextResponse.json({
          message: "User deleted",
          user: { username: deletedUser?.username },
        });
      } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
          { message: "Error deleting user", error: String(error) },
          { status: 500 },
        );
      }
    }

    console.log("ℹ️ Unhandled event type:", eventType);

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (error) {
    console.error("❌ Webhook handler error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}
