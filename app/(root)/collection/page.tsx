import { auth } from "@clerk/nextjs/server";

import { getSavedQuestions } from "@/lib/actions/user.action";

import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";

import { QuestionFilters } from "@/constants/filters";
import { IQuestion } from "@/database/question.model";

export default async function Collection() {
  const { userId } = await auth();

  if (!userId) return null;

  const result = await getSavedQuestions({
    clerkId: userId,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search within your saved questions..."
          otherClasses="flex-1"
        />
        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <div className="mt-10 flex flex-col w-full gap-6">
        {/* Loop over questions and display a QuestionCard */}
        {result.questions.length > 0 ? (
          result.questions.map((question: IQuestion, index: number) => (
            <QuestionCard
              key={index}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              createdAt={question.createdAt}
              upvotes={question.upvotes}
              answers={question.answers}
              views={question.views}
            />
          ))
        ) : (
          <NoResult
            title="There's no questions saved to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
						discussion. Your query could be the next big thing others learn from.
						Get involved! 💡"
            link="/ask-question"
            buttonTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
}
