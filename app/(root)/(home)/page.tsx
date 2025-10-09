import Link from "next/link";

import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { Button } from "@/components/ui/button";

import { HomePageFilters } from "@/constants/filters";

const questions = [
  // {
  //   _id: 1,
  //   title: "Cascading Deletes in SQLAlchemy?",
  //   tags: [
  //     { _id: 1, name: "python" },
  //     { _id: 2, name: "databases" },
  //     { _id: 3, name: "sqlalchemy" },
  //   ],
  //   author: "John Doe",
  //   createdAt: "2025-10-09T12:00:00.000Z",
  //   upvotes: 10,
  //   answers: 1,
  //   views: 24,
  // },
  // {
  //   _id: 2,
  //   title: "How do I use express as a customer server in NextJs",
  //   tags: [
  //     { _id: 1, name: "next15" },
  //     { _id: 2, name: "express" },
  //     { _id: 3, name: "fastify" },
  //   ],
  //   author: "Julia",
  //   createdAt: "2025-10-08T11:10:32.000Z",
  //   upvotes: 9,
  //   answers: 2,
  //   views: 15,
  // },
  // {
  //   _id: 3,
  //   title: "Best Practices for REST API Design",
  //   tags: [
  //     { _id: 1, name: "api" },
  //     { _id: 2, name: "backend" },
  //     { _id: 3, name: "architecture" },
  //   ],
  //   author: "Alice Johnson",
  //   createdAt: "2025-10-07T08:30:00.000Z",
  //   upvotes: 152,
  //   answers: 15,
  //   views: 2500,
  // },
  // {
  //   _id: 4,
  //   title: "How to center a div?",
  //   tags: [
  //     { _id: 1, name: "css" },
  //     { _id: 2, name: "html" },
  //     { _id: 3, name: "frontend" },
  //   ],
  //   author: "Bob Smith",
  //   createdAt: "2025-09-15T21:45:10.000Z",
  //   upvotes: 2500,
  //   answers: 42,
  //   views: 180500,
  // },
  // {
  //   _id: 5,
  //   title: "Understanding Promises in JavaScript",
  //   tags: [
  //     { _id: 1, name: "javascript" },
  //     { _id: 2, name: "async" },
  //     { _id: 3, name: "es6" },
  //   ],
  //   author: "Charlie Brown",
  //   createdAt: "2025-10-01T14:00:00.000Z",
  //   upvotes: 890,
  //   answers: 22,
  //   views: 34000,
  // },
  // {
  //   _id: 6,
  //   title: "What's the difference between a list and a tuple in Python?",
  //   tags: [
  //     { _id: 1, name: "python" },
  //     { _id: 2, name: "data-structures" },
  //     { _id: 3, name: "arrays" },
  //   ],
  //   author: "Diana Prince",
  //   createdAt: "2025-08-22T05:18:00.000Z",
  //   upvotes: 1200,
  //   answers: 18,
  //   views: 95000,
  // },
  // {
  //   _id: 7,
  //   title: "Configuring Tailwind CSS with a new Next.js 15 project",
  //   tags: [
  //     { _id: 1, name: "next15" },
  //     { _id: 2, name: "tailwindcss" },
  //     { _id: 3, name: "frontend" },
  //   ],
  //   author: "Ethan Hunt",
  //   createdAt: "2025-10-09T09:05:00.000Z",
  //   upvotes: 45,
  //   answers: 3,
  //   views: 850,
  // },
];

export default function Home() {
  return (
    <>
      {/* For topbar and as question button  */}
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Link href="/ask-questions" className="flex justify-end max-sm:w-full">
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
        {questions.length > 0 ? (
          questions.map((question) => "QuestionCard")
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
