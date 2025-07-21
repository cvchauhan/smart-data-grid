export class PaginationManager {
  paginate(data: any[], page: number, pageSize: number): any[] {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }
}
