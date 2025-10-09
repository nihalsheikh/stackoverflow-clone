import Link from "next/link";

import LocalSearch from "@/components/shared/search/LocalSearch";
import { Button } from "@/components/ui/button";

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
        {/* TODO: LocalSearchbar Component */}
        <LocalSearch
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions..."
          otherClasses="flex-1"
        />
        FilterButton
      </div>
    </>
  );
}
