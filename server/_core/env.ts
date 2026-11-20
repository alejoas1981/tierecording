// Platform values are read at use time. See the Webdev service/authentication skills.
export const ENV = {
  get appId() { return process.env.ALEKSEY_SAVCHENKO_PROJECT_ID ?? ""; },
  get cookieSecret() { return process.env.ALEKSEY_SAVCHENKO_JWT_SECRET ?? ""; },
  get databaseUrl() { return process.env.DATABASE_URL ?? ""; },
  get oAuthServerUrl() { return process.env.ALEKSEY_SAVCHENKO_OAUTH_API_URL ?? ""; },
  // Preserve the legacy hint when supplied; otherwise roles remain application data.
  get ownerOpenId() { return process.env.OWNER_OPEN_ID ?? ""; },
  get isProduction() { return process.env.NODE_ENV === "production"; },
  get forgeApiUrl() { return process.env.ALEKSEY_SAVCHENKO_API_URL ?? ""; },
  get forgeApiKey() { return process.env.ALEKSEY_SAVCHENKO_API_KEY ?? ""; },
};
