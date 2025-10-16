"use server";

import { getResponse } from "../agents/chat";

export const submitChat = async (data: { message: string }) => {
  return await getResponse(data.message);
};
