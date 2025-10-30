import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <Skeleton className="h-12 w-52 bg-gray-200" />

      <Skeleton className="mb-12 mt-11 h-14 w-full bg-gray-200" />

      <div className="flex flex-col gap-6">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
          <Skeleton key={item} className="h-48 w-full rounded-xl bg-gray-200" />
        ))}
      </div>
    </section>
  );
};

export default Loading;
