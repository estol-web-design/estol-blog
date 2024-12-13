export const articlePopulation = [
  {
    path: "author",
    select: "username",
  },
  {
    path: "comments",
    populate: {
      path: "author",
      select: "username",
    },
  },
  {
    path: "likes",
    select: "username",
  },
];
