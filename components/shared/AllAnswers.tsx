import Image from "next/image";
import Link from "next/link";

import { getAnswers } from "@/lib/actions/answer.action";
import { getTimeStamp } from "@/lib/utils";

import Filter from "./Filter";
import Pagination from "./Pagination";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";
import { AnswerFilters } from "@/constants/filters";

interface Props {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: string;
}

const AllAnswers = async ({
  questionId,
  userId,
  totalAnswers,
  page,
  filter,
}: Props) => {
  const result = await getAnswers({
    questionId,
    page: page ? +page : 1,
    sortBy: filter,
  });
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>

        <Filter filters={AnswerFilters} />
      </div>

      <div>
        {result.answers.map((answer) => (
          <article key={answer._id} className="light-border border-b py-10">
            <div className="flex items-center justify-between">
              <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <Link
                  href={`/profile/${answer.author.clerkId}`}
                  className="flex flex-1 items-start gap-1 sm:items-center"
                >
                  <Image
                    src={answer.author.pictureUrl}
                    alt="Profile"
                    width={18}
                    height={18}
                    className="rounded-full object-cover max-sm:mt-0.5"
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="body-semibold text-dark300_light700">
                      {answer.author.name}&nbsp;
                    </p>
                    <p className="small-regular text-light400_light500 mt-0.5 line-clamp-1 ml-0.5">
                      answered&nbsp;{getTimeStamp(answer.createdAt)}
                    </p>
                  </div>
                </Link>

                <div className="flex justify-end">
                  <Votes
                    type="Answer"
                    itemId={JSON.stringify(answer._id)} // id of question // remove Stringify if unnecessary
                    userId={userId ? JSON.stringify(userId) : ""}
                    upvotes={answer.upvotes.length}
                    hasupVoted={
                      userId ? answer.upvotes.includes(userId) : false
                    }
                    downvotes={answer.downvotes.length}
                    hasdownVoted={
                      userId ? answer.downvotes.includes(userId) : false
                    }
                  />
                </div>
              </div>
            </div>
            <ParseHTML data={answer.description} />
          </article>
        ))}
      </div>

      <div className="mt-10 w-full">
        <Pagination pageNumber={page ? +page : 1} isNext={result.isNext} />
      </div>
    </div>
  );
};

export default AllAnswers;
