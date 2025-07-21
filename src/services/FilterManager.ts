export class FilterManager {
  applyGlobalFilter(data: any[], filterValue: string): any[] {
    return data.filter((row: any) =>
      Object.values(row).some((val: any) =>
        String(val).toLowerCase().includes(filterValue.toLowerCase())
      )
    );
  }
}
