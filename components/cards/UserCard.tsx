import RenderTag from "../shared/RenderTag";
import { Badge } from "../ui/badge";

import Image from "next/image";
import Link from "next/link";

import { getTopInteractedTags } from "@/lib/actions/tag.actions";

interface UserCardProps {
  user: {
    _id: string;
    clerkId: string;
    pictureUrl: string;
    name: string;
    username: string;
  };
}

const UserCard = async ({ user }: UserCardProps) => {
  const interactedTags = await getTopInteractedTags({ userId: user._id });

  return (
    <article className="shadow-light100_darknone background-light900_dark200 light-border w-full max-xs:min-w-full xs:w-[260px] rounded-2xl border p-8 flex flex-col items-center">
      {/* Make only the header section clickable */}
      <Link
        href={`/profile/${user.clerkId}`}
        className="flex w-full flex-col items-center justify-center"
      >
        <Image
          src={user.pictureUrl}
          alt={user.name}
          width={100}
          height={100}
          className="rounded-full"
        />
        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.username}
          </p>
        </div>
      </Link>

      {/* Tags are inside the same card container */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {interactedTags.length > 0 ? (
          interactedTags.map((tag) => (
            <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
          ))
        ) : (
          <Badge>No tags yet</Badge>
        )}
      </div>
    </article>
  );
};

export default UserCard;
