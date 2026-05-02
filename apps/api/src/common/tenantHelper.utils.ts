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