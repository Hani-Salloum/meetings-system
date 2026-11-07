type FieldsDetails = {
  color: string;
  section: string;
  items: FieldsDetailsElement[];
}[];

type FieldsDetailsElement = {
  name: string;
  label: string;
  hidden?: boolean;
  color?: string;
  type:
    | "boolean"
    | "date"
    | "list"
    | "text"
    | "image"
    | "number"
    | "button"
    | "period"
    | "component"
    | "color";
  className: string;
  CustomButton?: any;
  CustomComponent?: any;
  renderData?: (value: any) => string | React.JSX.Element;
};
