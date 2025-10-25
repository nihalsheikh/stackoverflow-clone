import { getQuestionsByTagId } from "@/lib/actions/tag.actions";

import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";

import { IQuestion } from "@/database/question.model";
import { URLProps } from "@/types";

const Page = async ({ params, searchParams }: URLProps) => {
  const { id } = await params;
  const { q } = await searchParams;

  const result = await getQuestionsByTagId({
    tagId: id,
    page: 1,
    searchQuery: q,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{result.tagTitle}</h1>

      <div className="mt-11 w-full">
        <LocalSearch
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search tag questions..."
          otherClasses="flex-1"
        />
      </div>

      <div className="mt-10 flex flex-col w-full gap-6">
        {/* Loop over questions and display a QuestionCard */}
        {result.questions.length > 0 ? (
          result.questions.map((question: IQuestion) => (
            <QuestionCard
              key={question._id}
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
            title="There's no tag question to show"
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
};

export default Page;
