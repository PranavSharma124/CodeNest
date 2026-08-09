import { getUsers } from "@/actions/getUsers";

export type Users = Awaited<ReturnType<typeof getUsers>>;
export type User = Users[number];