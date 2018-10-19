export interface IFilter {
  id: string;
  type: "date" | "user";
  shouldRemove: (value: any) => boolean;
}
