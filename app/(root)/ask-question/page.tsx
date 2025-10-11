import { auth } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";

import { getUserById } from "@/lib/actions/user.action";

import QuestionForm from "@/components/forms/QuestionForm";

const Page = async () => {
  // get current userId from clerk
  // const { userId } = auth();
  const userId = "clerk_9f87gh12xyZ";

  // if no current userId then go to sign-in
  if (!userId) redirect("sign-in");

  // When we have userId
  const mongoUser = await getUserById({ userId });

  console.log(mongoUser);

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>

      <div className="mt-9">
        <QuestionForm mongoUserId={JSON.stringify(mongoUser._id)} />
      </div>
    </div>
  );
};

export default Page;
