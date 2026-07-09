export function batchArray<T>(
  items: T[],
  batchSize = 25
): T[][] {

  const batches: T[][] = [];

  for (let i = 0; i < items.length; i += batchSize) {

    batches.push(
      items.slice(i, i + batchSize)
    );

  }

  return batches;

}