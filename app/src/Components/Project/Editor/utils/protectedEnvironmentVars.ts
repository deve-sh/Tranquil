const protectedEnvironmentVars: string[] = ["PORT", "NODE_ENV"];

const isProtectedEnvironmentVariable = (key: string) =>
	protectedEnvironmentVars.includes(key);

export default isProtectedEnvironmentVariable;
