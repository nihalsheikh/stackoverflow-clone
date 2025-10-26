import Image from "next/image";
import Link from "next/link";

import EditDeleteAction from "../shared/EditDeleteAction";
import { SignedIn } from "@clerk/nextjs";

import { formatNumber, getTimeStamp } from "@/lib/utils";

interface Props {
  clerkId?: string | null;
  _id: string;
  question: {
    _id: string;
    title: string;
  };
  author: {
    _id: string;
    clerkId: string;
    name: string;
    pictureUrl: string;
  };
  upvotes: number;
  createdAt: Date;
}

const AnswerCard = ({
  clerkId,
  _id,
  question,
  author,
  upvotes,
  createdAt,
}: Props) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;

  return (
    <div className="card-wrapper rounded-[10px] px-11 py-9">
      {/* Question link - clickable title area */}
      <Link href={`/question/${question?._id}/#${_id}`}>
        <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
          <div>
            <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
              {getTimeStamp(createdAt)}
            </span>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1 hover:underline">
              {question.title}
            </h3>
          </div>

          <SignedIn>
            {showActionButtons && (
              <EditDeleteAction type="Answer" itemId={JSON.stringify(_id)} />
            )}
          </SignedIn>
        </div>
      </Link>

      {/* Author and stats - separate clickable area */}
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Link href={`/profile/${author.clerkId}`} className="flex-center gap-1">
          <Image
            src={author.pictureUrl}
            alt="user avatar"
            width={20}
            height={20}
            className="rounded-full"
          />
          <p className="body-medium text-dark400_light700">
            {author.name}
            <span className="small-regular text-dark400_light700 ml-1">
              • asked {getTimeStamp(createdAt)}
            </span>
          </p>
        </Link>

        <div className="flex-center gap-3">
          <div className="flex-center gap-1">
            <Image
              src="/assets/icons/like.svg"
              alt="like icon"
              width={16}
              height={16}
            />
            <p className="small-medium text-dark400_light800">
              {formatNumber(upvotes)} Votes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
