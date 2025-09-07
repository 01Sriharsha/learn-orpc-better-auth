import * as authRoute from "./routes/auth.route";

export const router = {
  auth: authRoute,
};

export type RPCRouter = typeof router;
