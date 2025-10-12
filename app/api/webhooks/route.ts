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
    console.log("Events: Creating User");

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

    console.log("User created");

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

// Put import on top
// import { Webhook } from "svix";
// import config from "@/config/config";
// import { headers } from "next/headers";

// new code starts here: PUT THIS INSIDE POST Function
// const WEBHOOK_SECRET = config.clerkWebhookSigningSecret;

// if (!WEBHOOK_SECRET) {
//   throw new Error(
//     "Please add WEBHOOK_SECRET from Clerk Dashboard to your Environment Variables",
//   );
// }

// const headerPayload = headers();

// const svixId = (await headerPayload).get("svix-id");
// const svixTimestamp = (await headerPayload).get("svix-timestamp");
// const svixSignature = (await headerPayload).get("svix-signature");

// // if there are no headers, error out
// if (!svixId || !svixTimestamp || !svixSignature) {
//   return new Response("Error occured -- no svix headers", { status: 400 });
// }

// // Get the Body
// const payload = await req.json();
// const body = JSON.stringify(payload);

// // create a new SVIX instance with secret
// const wh = new Webhook(WEBHOOK_SECRET);

// let evt: WebhookEvent;

// // Verify the payload with headers
// try {
//   evt = wh.verify(body, {
//     "svix-id": svixId,
//     "svix-timestamp": svixTimestamp,
//     "svix-signature": svixSignature,
//   }) as WebhookEvent;
// } catch (error) {
//   console.error("Error verifying webhook: ", error);
//   return new Response("Error occured", { status: 400 });
// }

// const eventType = evt.type;
// // new code ends here
