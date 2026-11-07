/* eslint-disable @typescript-eslint/no-explicit-any */
export function getFieldType(prisma: any, tableName: string, fieldName: string): string | null {
  const fields = prisma[tableName].fields;

  const field = fields[fieldName];

  if (!field) return null;

  //**example */
  // fields cr {
  //   modelName: 'FavoriteLocation',
  //   name: 'updated_at',
  //   typeName: 'DateTime',
  //   isList: false,
  //   isEnum: false
  // }

  let fieldType: string | null = null;
  switch (field.typeName) {
    case "Int":
    case "Float":
    case "BigInt":
      fieldType = "number";
      break;
    case "String":
      fieldType = "text";
      break;
    case "DateTime":
      fieldType = "date";
      break;
    case "Boolean":
      fieldType = "boolean";
      break;
    default:
      fieldType = null;
  }

  return fieldType;
}

export function getSearchableFields(prisma: any, tableName: string): string[] {
  const fields = prisma[tableName].fields;
  return Object.keys(fields).filter((fieldName) => {
    const type = getFieldType(prisma, tableName, fieldName);
    return type === "text" || type === "number" || type === "date";
  });
}

export function isFloatField(prisma: any, tableName: string, fieldName: string): boolean {
  const fields = prisma[tableName].fields;
  const field = fields[fieldName];
  return field?.typeName === "Float";
}
