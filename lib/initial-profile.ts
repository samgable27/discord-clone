import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();

  //   if no user exists, redirect to sign in page
  if (!user) {
    return redirectToSignIn();
  }

  //   check if profile exists and find unique profile
  const profile = await db.profile.findUnique({
    where: { userId: user.id },
  });

  if (profile) {
    return profile;
  }

  //   if no profile exists, create a new profile
  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newProfile;
};
