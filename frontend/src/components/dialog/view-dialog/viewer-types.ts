import {
  BooleanViewer,
  DateViewer,
  ImageViewer,
  ListViewer,
  NumberViewer,
  ObjectViewer,
  StringTitleViewer,
  StringViewer,
} from "./viewers/defaults";

const types = {
  string: StringViewer,
  stringTitle: StringTitleViewer,
  number: NumberViewer,
  date: DateViewer,
  boolean: BooleanViewer,
  list: ListViewer,
  image: ImageViewer,
  object: ObjectViewer,
};

export default types;
