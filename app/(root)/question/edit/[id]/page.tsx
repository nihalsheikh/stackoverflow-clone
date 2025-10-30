import type { Metadata } from "next";

import { auth } from "@clerk/nextjs/server";

import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";

import QuestionForm from "@/components/forms/QuestionForm";

import { ParamsProps } from "@/types";

export const metadata: Metadata = {
  title: "Edit Question | CodeOverflow",
};

const Page = async ({ params }: ParamsProps) => {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) return null;

  const mongoUser = await getUserById({ userId });

  const result = await getQuestionById({ questionId: id });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>

      <div className="mt-9">
        <QuestionForm
          type="Edit"
          mongoUserId={JSON.stringify(mongoUser._id)}
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </>
  );
};

export default Page;
