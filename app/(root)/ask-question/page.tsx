import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";

import { getUserById } from "@/lib/actions/user.action";

import QuestionForm from "@/components/forms/QuestionForm";

const Page = async () => {
  // get current userId from clerk
  const { userId } = await auth();

  // if no current userId then go to sign-in
  if (!userId) redirect("sign-in");

  // When we have userId
  const mongoUser = await getUserById({ userId });

  // If user doesn't exist in MongoDB, show error or create user
  if (!mongoUser) {
    return (
      <div className="flex-center h-screen flex-col gap-4">
        <h1 className="h1-bold text-dark100_light900">User Not Found</h1>
        <p className="body-regular text-dark500_light700">
          Your account is not synced with our database yet.
        </p>
        <p className="body-regular text-dark500_light700">
          Please try signing out and signing back in, or contact support.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="primary-gradient min-h-[46px] rounded-lg px-4 py-3 text-light-900"
        >
          Reload Page
        </button>
      </div>
    );
  }

  // console.log(mongoUser);

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
