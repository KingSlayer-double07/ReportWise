export async function withTenant<T>(
  prisma: any,
  slug: string,
  fn: (tx: any) => Promise<T>
): Promise<T> {
  console.log(`withTenant: Setting search_path to school_${slug} for tenant-aware operation`);

  return prisma.$transaction(async (tx) => {

    await tx.$executeRawUnsafe(
      `SET search_path TO "school_${slug}", public`
    );

    const path = await tx.$queryRaw`SHOW search_path`;
    console.log('withTenant - ACTIVE search_path:', path);

    return fn(tx);
  });
}

export async function retry<T>(
  fn: () =>
    Promise<T>,
  retries = 5
) {
  try {
    return await fn();
  } catch (err: any) {
    if (retries > 0 && err.code === 'EAI_AGAIN') {
      await new Promise((res) => setTimeout(res, 1000));
      return retry(fn, retries - 1);
    }
    throw err;
  }
}