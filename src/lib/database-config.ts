function getDatabaseUrl() {
  return process.env.DATABASE_URL ?? "";
}

export function hasUsableDatabaseUrl() {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    return false;
  }

  return !(
    databaseUrl.includes("mysql://USER:PASSWORD@") ||
    databaseUrl.includes("@localhost:3306/lux_remodeling")
  );
}
