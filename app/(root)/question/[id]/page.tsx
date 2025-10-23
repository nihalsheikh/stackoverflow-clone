import Image from "next/image";
import Link from "next/link";

import { getQuestionById } from "@/lib/actions/question.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";

import Answer from "@/components/forms/Answer";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";

const Page = async ({ params, searchParams }) => {
  // console.log(params);
  const result = await getQuestionById({ questionId: params.id });

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${result.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={result.author.pictureUrl}
              alt="Profile picture"
              width={22}
              height={22}
              className="rounded-full"
            />

            <p className="paragraph-semibold text-dark300_light700">
              {result.author.name}
            </p>
          </Link>

          <div className="flex justify-end">
            {/* TODO: add the Upvote Downvote system */}
            Upvote Downvote
          </div>
        </div>

        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result.title}
        </h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric // For Votes
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimeStamp(result.createdAt)}`}
          title=" Asked"
          textStyles="small-medium text-dark400_light800"
        />

        <Metric // For Answers
          imgUrl="/assets/icons/message.svg"
          alt="answers"
          value={formatNumber(result.answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />

        <Metric // For Views
          imgUrl="/assets/icons/eye.svg"
          alt="views"
          value={formatNumber(result.views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      <ParseHTML data={result.description} />
      {/* remember we are using description and not content */}

      <div className="mt-8 flex flex-wrap gap-2">
        {result.tags.map((tag: any) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <Answer />
    </>
  );
};

export default Page;
