"use server";

import { getResponse } from "./chat";

export const submitChat = async (data: { message: string }) => {
  return await getResponse(data.message);
};
