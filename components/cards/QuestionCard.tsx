import Link from "next/link";

import Metric from "../shared/Metric";
import RenderTag from "../shared/RenderTag";

import { formatNumber, getTimeStamp } from "@/lib/utils";

interface QuestionCardProps {
  _id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
    pictureUrl: string;
    clerkId: string;
  };
  createdAt: Date;
  upvotes: string[];
  answers: Array<object>;
  views: number;
  clerkId?: string;
}

const QuestionCard = ({
  clerkId,
  _id,
  title,
  tags,
  author,
  createdAt,
  upvotes,
  answers,
  views,
}: QuestionCardProps) => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        {/* TODO: If a User is SignedIn, then ADD a Edit and Delete Button Action */}
      </div>

      {/* Tags */}
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>

      {/* Author and Post Creation Details */}
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        {/* Metric: Upvotes, Answers, Views */}
        <Metric // For Author
          imgUrl={author.pictureUrl}
          alt="user"
          value={author.name}
          title={` - asked ${getTimeStamp(createdAt)}`}
          href={`/profile/${author.clerkId}`}
          isAuthor
          textStyles="body-medium text-dark400_light700"
        />

        <Metric // For Votes
          imgUrl="/assets/icons/like.svg"
          alt="upvotes"
          value={formatNumber(upvotes.length)}
          title=" Votes"
          textStyles="small-medium text-dark400_light800"
        />

        <Metric // For Answers
          imgUrl="/assets/icons/message.svg"
          alt="answers"
          value={formatNumber(answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />

        <Metric // For Views
          imgUrl="/assets/icons/eye.svg"
          alt="views"
          value={formatNumber(views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
    </div>
  );
};

export default QuestionCard;
