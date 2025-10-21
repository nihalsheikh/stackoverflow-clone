import Link from "next/link";

import { getQuestions } from "@/lib/actions/question.action";

import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { Button } from "@/components/ui/button";

import { HomePageFilters } from "@/constants/filters";

export default async function Home() {
  const result = await getQuestions({});

  // console.log(result.questions);

  return (
    <>
      {/* For topbar and as question button  */}
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>

      {/* Search Questyion and Fileter Option */}
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions..."
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

      <div className="mt-10 flex flex-col w-full gap-6">
        {/* Loop over questions and display a QuestionCard */}
        {result.questions.length > 0 ? (
          result.questions.map((question) => (
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
            title="There's no questions to show"
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
