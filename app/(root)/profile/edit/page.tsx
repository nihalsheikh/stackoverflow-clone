import { auth } from "@clerk/nextjs/server";

import { getUserById } from "@/lib/actions/user.action";

import Profile from "@/components/forms/Profile";

import { ParamsProps } from "@/types";

const Page = async ({ params }: ParamsProps) => {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) return null;

  const mongoUserRaw = await getUserById({ userId });
  const mongoUser = JSON.stringify(mongoUserRaw);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

      <div className="mt-9">
        <Profile clerkId={userId} user={mongoUser} />
      </div>
    </>
  );
};

export default Page;
