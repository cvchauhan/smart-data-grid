export class VirtualScroller {
  getVisibleRows(data: any[], start: number, end: number): any[] {
    return data.slice(start, end);
  }
}
