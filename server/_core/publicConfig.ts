// Only these public values may reach the browser. Never serialize process.env.
export function publicPlatformConfig(env: NodeJS.ProcessEnv = process.env) {
  return {
    projectId: env.ALEKSEY_SAVCHENKO_PROJECT_ID ?? "",
    oauthPortalUrl: env.ALEKSEY_SAVCHENKO_OAUTH_PORTAL_URL ?? "",
    apiUrl: env.ALEKSEY_SAVCHENKO_API_URL ?? "",
    apiBrowserKey: env.ALEKSEY_SAVCHENKO_API_BROWSER_KEY ?? "",
  };
}

export function publicPlatformScript(env: NodeJS.ProcessEnv = process.env): string {
  const json = JSON.stringify(publicPlatformConfig(env)).replaceAll("<", "\\u003c");
  return `window.__ALEKSEY_SAVCHENKO_CONFIG__=${json};`;
}
