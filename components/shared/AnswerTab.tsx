import AnswerCard from "../cards/AnswerCard";
import console from "console";

import { getUserAnswers } from "@/lib/actions/user.action";

import page from "@/app/(root)/(home)/page";

import Pagination from "./Pagination";
import { SearchParamsProps } from "@/types";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswersTab = async ({ searchParams, userId, clerkId }: Props) => {
  const { page } = await searchParams;
  const result = await getUserAnswers({
    userId,
    page: page ? +page : 1,
  });

  return (
    <>
      {result.answers.map((item) => (
        <AnswerCard
          key={item._id}
          clerkId={clerkId}
          _id={item._id}
          question={item.question}
          author={item.author}
          upvotes={item.upvotes.length}
          createdAt={item.createdAt}
        />
      ))}

      <div className="mt-10">
        <Pagination pageNumber={page ? +page : 1} isNext={result.isNext} />
      </div>
    </>
  );
};

export default AnswersTab;
