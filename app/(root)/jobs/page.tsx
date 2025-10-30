import React from "react";

import NoResult from "@/components/shared/NoResult";

const page = () => {
  return (
    <div className="">
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>

      <div className="mt-10 flex flex-col w-full gap-6">
        <NoResult
          title="Listing Jobs soon..."
          description="Page currently in development, you will be notified when the page is live, stay tuned."
          link="/"
          buttonTitle="Home"
        />
      </div>
    </div>
  );
};

export default page;
