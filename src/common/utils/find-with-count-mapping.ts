import { PaginatedResponseDto } from '../dto/paginated-response.dto';

export function findWithCountMapping<T, TExtra = object>(
  items: T[],
  count: number,
  extra?: TExtra,
): PaginatedResponseDto<T> & TExtra {
  return { items, count, ...(extra ?? {}) } as PaginatedResponseDto<T> & TExtra;
}
