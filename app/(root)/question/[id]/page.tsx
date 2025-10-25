import Image from "next/image";
import Link from "next/link";

import { auth } from "@clerk/nextjs/server";

import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";

import Answer from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Votes from "@/components/shared/Votes";

// searchParams: use this if you need
const Page = async (props: any) => {
  const { params } = await props;
  const { userId: clerkId } = await auth();

  let mongoUser;

  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  }

  const { id } = await params;

  const result = await getQuestionById({ questionId: id });

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
            <Votes
              type="Question"
              itemId={JSON.stringify(result._id)} // id of question // remove Stringify if unnecessary
              userId={mongoUser ? JSON.stringify(mongoUser._id) : ""}
              upvotes={result.upvotes.length}
              hasupVoted={
                mongoUser ? result.upvotes.includes(mongoUser._id) : false
              }
              downvotes={result.downvotes.length}
              hasdownVoted={
                mongoUser ? result.downvotes.includes(mongoUser._id) : false
              }
              hasSaved={
                mongoUser ? mongoUser?.savedPost.includes(result._id) : false
              }
            />
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

      <AllAnswers
        questionId={result._id}
        userId={mongoUser ? mongoUser._id : ""}
        totalAnswers={result.answers.length}
      />

      {mongoUser && (
        <Answer
          question={result.description}
          questionId={JSON.stringify(result._id)}
          authorId={JSON.stringify(mongoUser._id)}
        />
      )}
    </>
  );
};

export default Page;
