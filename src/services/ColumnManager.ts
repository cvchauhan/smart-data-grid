export class ColumnManager {
  sort(data: any[], key: string, asc = true): any[] {
    return data.slice().sort((a, b) => {
      const x = a[key],
        y = b[key];
      return asc ? (x > y ? 1 : -1) : x < y ? 1 : -1;
    });
  }
}
