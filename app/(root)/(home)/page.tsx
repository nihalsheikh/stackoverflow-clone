import Link from "next/link";

import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { Button } from "@/components/ui/button";

import { HomePageFilters } from "@/constants/filters";

const questions = [
  {
    _id: "1",
    title: "Cascading Deletes in SQLAlchemy?",
    tags: [
      { _id: "1", name: "python" },
      { _id: "2", name: "databases" },
      { _id: "3", name: "sqlalchemy" },
    ],
    author: {
      _id: "author1",
      name: "John Doe",
      picture: "https://i.pravatar.cc/150?u=author1",
    },
    createdAt: new Date("2025-10-09T12:00:00.000Z"),
    upvotes: 1021345678,
    answers: [{}],
    views: 2123458754,
  },
  {
    _id: "2",
    title: "How do I use express as a customer server in NextJs",
    tags: [
      { _id: "4", name: "next15" },
      { _id: "5", name: "express" },
      { _id: "6", name: "fastify" },
    ],
    author: {
      _id: "author2",
      name: "Julia",
      picture: "https://i.pravatar.cc/150?u=author2",
    },
    createdAt: new Date("2025-10-08T11:10:32.000Z"),
    upvotes: 9178334,
    answers: [{}, {}],
    views: 41237895,
  },
  {
    _id: "3",
    title: "Best Practices for REST API Design",
    tags: [
      { _id: "7", name: "api" },
      { _id: "8", name: "backend" },
      { _id: "9", name: "architecture" },
    ],
    author: {
      _id: "author3",
      name: "Alice Johnson",
      picture: "https://i.pravatar.cc/150?u=author3",
    },
    createdAt: new Date("2025-10-07T08:30:00.000Z"),
    upvotes: 15212756309,
    answers: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    views: 250562340,
  },
  {
    _id: "4",
    title: "How to center a div?",
    tags: [
      { _id: "10", name: "css" },
      { _id: "11", name: "html" },
      { _id: "12", name: "frontend" },
    ],
    author: {
      _id: "author4",
      name: "Bob Smith",
      picture: "https://i.pravatar.cc/150?u=author4",
    },
    createdAt: new Date("2025-09-15T21:45:10.000Z"),
    upvotes: 250230,
    answers: Array(42).fill({}),
    views: 180123500,
  },
  {
    _id: "5",
    title: "Understanding Promises in JavaScript",
    tags: [
      { _id: "13", name: "javascript" },
      { _id: "14", name: "async" },
      { _id: "15", name: "es6" },
    ],
    author: {
      _id: "author5",
      name: "Charlie Brown",
      picture: "https://i.pravatar.cc/150?u=author5",
    },
    createdAt: new Date("2025-10-01T14:00:00.000Z"),
    upvotes: 89356780,
    answers: Array(22).fill({}),
    views: 34000,
  },
  {
    _id: "6",
    title: "What's the difference between a list and a tuple in Python?",
    tags: [
      { _id: "1", name: "python" },
      { _id: "16", name: "data-structures" },
    ],
    author: {
      _id: "author6",
      name: "Diana Prince",
      picture: "https://i.pravatar.cc/150?u=author6",
    },
    createdAt: new Date("2025-08-22T05:18:00.000Z"),
    upvotes: 120031245,
    answers: Array(18).fill({}),
    views: 95000,
  },
  {
    _id: "7",
    title: "Configuring Tailwind CSS with a new Next.js 15 project",
    tags: [
      { _id: "4", name: "next15" },
      { _id: "17", name: "tailwindcss" },
      { _id: "12", name: "frontend" },
    ],
    author: {
      _id: "author7",
      name: "Ethan Hunt",
      picture: "https://i.pravatar.cc/150?u=author7",
    },
    createdAt: new Date("2025-10-09T09:05:00.000Z"),
    upvotes: 4123895,
    answers: [{}, {}, {}],
    views: 82350,
  },
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
          questions.map((question) => (
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
