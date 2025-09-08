import "server-only";

import arcjet, {
  detectBot,
  shield,
  validateEmail,
  fixedWindow,
} from "@arcjet/next";

const isDev = process.env.NODE_ENV === "development";
const MODE = isDev ? "DRY_RUN" : "LIVE";

export const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  // log: {
  //   debug: (msg) => {
  //     console.log("ARCJET DEBUG: ", msg);
  //   },
  //   info: (msg) => {
  //     console.log("ARCJET INFO: ", msg);
  //   },
  //   warn: (msg) => {
  //     console.log("ARCJET WARN: ", msg);
  //   },
  //   error: (msg) => {
  //     console.log("ARCJET ERROR: ", msg);
  //   },
  // },
  rules: [
    shield({
      mode: MODE,
    }),
    detectBot({
      mode: MODE, // will block requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [isDev ? "POSTMAN" : "CATEGORY:SEARCH_ENGINE"],
    }),
  ],
});

export const validateEmailWithArcjet = aj.withRule(
  validateEmail({
    deny: ["DISPOSABLE", "FREE", "INVALID", "NO_GRAVATAR", "NO_MX_RECORDS"],
    mode: MODE,
  })
);

export const rateLimitUser = (userId?: string) => {
  const maxRequests = 20;
  const window = 60;
  return aj.withRule(
    fixedWindow({
      characteristics: [userId ? "userId" : "ip.src"],
      mode: MODE,
      window,
      max: userId ? maxRequests * 2 : maxRequests,
    })
  );
};
