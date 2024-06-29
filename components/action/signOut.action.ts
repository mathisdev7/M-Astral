"use server";
import { signOut } from "@/auth/auth";

export const signOutAction = async () => {
  await signOut();
};
