// app/api/webhooks/route.ts
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

    console.log("🔔 Webhook received");

    // Get headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error("❌ Missing svix headers");
      return NextResponse.json(
        { error: "Missing svix headers" },
        { status: 400 },
      );
    }

    // Get body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    console.log("📦 Webhook payload received, event type:", payload.type);

    // Verify webhook
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
      console.log("✅ Webhook verified successfully");
    } catch (err) {
      console.error("❌ Webhook verification failed:", err);
      return NextResponse.json(
        { error: "Webhook verification failed" },
        { status: 400 },
      );
    }

    // Handle the webhook
    const eventType = evt.type;
    console.log("🎯 Processing event type:", eventType);

    if (eventType === "user.created") {
      const {
        id,
        email_addresses,
        username,
        first_name,
        last_name,
        image_url,
      } = evt.data;

      console.log("👤 Creating user:");
      console.log("   - clerkId:", id);
      console.log("   - email:", email_addresses[0].email_address);
      console.log("   - name:", first_name, last_name);
      console.log("   - username:", username);

      try {
        const mongoUser = await createUser({
          clerkId: id,
          name:
            `${first_name || ""}${last_name ? ` ${last_name}` : ""}`.trim() ||
            "User",
          username: username || email_addresses[0].email_address.split("@")[0],
          email: email_addresses[0].email_address,
          picture: image_url,
        });

        console.log("✅ User created successfully in MongoDB");
        console.log("   - MongoDB _id:", mongoUser?._id);
        console.log("   - clerkId:", mongoUser?.clerkId);

        return NextResponse.json(
          {
            success: true,
            message: "User created successfully",
            userId: mongoUser?._id,
          },
          { status: 200 },
        );
      } catch (error) {
        console.error("❌ Error creating user:", error);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to create user",
            details: String(error),
          },
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

      console.log("👤 Updating user:");
      console.log("   - clerkId:", id);
      console.log("   - new name:", first_name, last_name);
      console.log("   - new username:", username);

      try {
        // Build update data object - only include username if it's not null
        const updateData: any = {
          name:
            `${first_name || ""}${last_name ? ` ${last_name}` : ""}`.trim() ||
            "User",
          email: email_addresses[0].email_address,
          pictureUrl: image_url,
        };

        // Only update username if it's provided and not null
        if (username && username !== null) {
          updateData.username = username;
        }

        const mongoUser = await updateUser({
          clerkId: id,
          updateData,
          path: `/profile/${id}`,
        });

        if (!mongoUser) {
          console.log("⚠️ User not found in MongoDB, creating new user...");

          // Create user if they don't exist
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

          console.log("✅ User created (was missing):", newUser?._id);
          return NextResponse.json(
            {
              success: true,
              message: "User created (was missing)",
              userId: newUser?._id,
            },
            { status: 200 },
          );
        }

        console.log("✅ User updated successfully in MongoDB");
        return NextResponse.json(
          {
            success: true,
            message: "User updated successfully",
            userId: mongoUser._id,
          },
          { status: 200 },
        );
      } catch (error) {
        console.error("❌ Error updating user:", error);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to update user",
            details: String(error),
          },
          { status: 500 },
        );
      }
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;

      console.log("🗑️ Deleting user with clerkId:", id);

      try {
        const deletedUser = await deleteUser({
          clerkId: id!,
        });

        console.log("✅ User deleted successfully");
        return NextResponse.json(
          {
            success: true,
            message: "User deleted successfully",
            username: deletedUser?.username,
          },
          { status: 200 },
        );
      } catch (error) {
        console.error("❌ Error deleting user:", error);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to delete user",
            details: String(error),
          },
          { status: 500 },
        );
      }
    }

    console.log("ℹ️ Unhandled event type:", eventType);
    return NextResponse.json(
      { success: true, message: "Webhook received" },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ Webhook handler error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: String(error),
      },
      { status: 500 },
    );
  }
}
