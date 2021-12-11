export default interface PagedResultDto<T> {
    totalCount: number;
    items: T[];
  }
