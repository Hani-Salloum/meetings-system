# FormBuilder Usage Guide

## Overview
The FormBuilder is a powerful and flexible form building system that allows you to create complex forms with validation, field dependencies, and dynamic behavior. It supports various field types including inputs, autocomplete, checkboxes, radio buttons, dates, and custom components.

## Basic Setup

### 1. Import Required Dependencies
```typescript
"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import Yup from "src/components/FormBuilder/utils/yup";

// Import field components
import AutocompleteField from "@/components/FormBuilder/FormFields/autocomplete-field";
import CheckboxField from "@/components/FormBuilder/FormFields/checkbox-field";
import DateField from "@/components/FormBuilder/FormFields/date-field";
import DateTimeField from "@/components/FormBuilder/FormFields/date-time-field";
import InputField from "@/components/FormBuilder/FormFields/input-field";
import RadioField from "@/components/FormBuilder/FormFields/radio-field";

// Import core FormBuilder components
import FormBuilder from "@/components/FormBuilder/form-builder";
import useFormBuilder from "@/components/FormBuilder/hooks/use-form-builder";
import prepareFields from "@/components/FormBuilder/utils/prepare-fields";
import prepareFieldArray from "./utils/prepare-field-array";

// Import specialized field components
import AutocompleteFieldOneTimeFetch from "./FormFields/autocomplete-field-one-time-fetch";
import AutocompleteFieldDependenciesFetch from "./FormFields/autocomplete-filed-dependencies-fetch";
import CountryCodeAutocompleteField from "./FormFields/countries-fields/country-code-autocomplete-field";
```

## Field Types and Usage

### 1. Basic Input Field
```typescript
name: {
  yup: Yup.string().required("Name is required"),
  type: "input",
  component: InputField,
  componentProps: {
    required: true,
    containerClassName: "col-span-12",
  },
}
```

### 2. Autocomplete Field
```typescript
country: {
  yup: Yup.string().required("Country is required"),
  type: "autocomplete",
  component: AutocompleteField,
  componentProps: {
    required: true,
    containerClassName: "col-span-12",
    placeholder: "Select a country",
    options: [
      { value: "us", label: "United States" },
      { value: "uk", label: "United Kingdom" },
      { value: "ca", label: "Canada" },
    ],
  },
}
```

### 3. Checkbox Field
```typescript
terms: {
  yup: Yup.boolean().oneOf([true], "You must accept the terms"),
  type: "checkbox",
  component: CheckboxField,
  componentProps: {
    required: true,
    label: "I accept the terms and conditions",
    containerClassName: "col-span-12",
  },
}
```

### 4. Radio Button Field
```typescript
gender: {
  yup: Yup.string().required("Gender is required"),
  type: "radio",
  component: RadioField,
  componentProps: {
    required: true,
    containerClassName: "col-span-12",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
    ],
  },
}
```

### 5. Date Field
```typescript
birthDate: {
  yup: Yup.date().required("Birth date is required"),
  type: "date",
  component: DateField,
  componentProps: {
    required: true,
    containerClassName: "col-span-12",
    placeholder: "Select birth date",
  },
}
```

### 6. DateTime Field
```typescript
meetingTime: {
  yup: Yup.date().required("Meeting time is required"),
  type: "datetime",
  component: DateTimeField,
  componentProps: {
    required: true,
    containerClassName: "col-span-12",
    placeholder: "Select meeting time",
  },
}
```

## Advanced Field Types

### 1. Country Code Autocomplete
```typescript
phone_country_code: {
  yup: Yup.string().required("Phone country code is required"),
  type: "country-autocomplete",
  component: CountryCodeAutocompleteField,
  componentProps: {
    color: "#fff",
    required: true,
    variant: "under_line",
    containerClassName: "md:col-span-4",
    label: "Phone Country Code",
    getOptions: (country) => ({
      label: country.nameEn,
      value: `+${country.callingCode}`,
      key: country.alpha2Code,
      filterKeys: [country.callingCode, country.nameEn, country.nameAr],
      icon: country.flag,
    }),
  },
}
```

### 2. Custom Component
```typescript
custom_component: {
  yup: Yup.string().required("Custom is required"),
  type: "custom",
  component: () => {
    return <div>{"Custom Component"}</div>;
  },
  componentProps: {},
}
```

## Conditional Fields

### 1. Field Dependencies with Watch
```typescript
guest_or_company: {
  yup: Yup.string().required(t("Validation.Required")),
  type: "autocomplete",
  component: AutocompleteField,
  componentProps: {
    color: "#fff",
    required: true,
    variant: "under_line",
    label: t("Guest Or Company"),
    autoFocus: true,
    containerClassName: "sm:col-span-6",
    options: [
      { label: t("Guest"), value: "guest" },
      { label: t("Company"), value: "company" },
    ],
  },
},

guest_details_id: {
  yup: Yup.object()
    .shape({
      value: Yup.number(),
      label: Yup.string(),
    })
    .when("guest_or_company", {
      is: (val: string) => val === "guest",
      then: (schema) => schema.required(t("Validation.Required")),
      otherwise: (schema) => schema.notRequired(),
    }),
  type: "autocomplete-one-time-fetch",
  component: AutocompleteFieldOneTimeFetch,
  componentProps: ({ watch }) => {
    const guestOrCompany = watch("guest_or_company");
    
    return {
      color: "#fff",
      required: false,
      hidden: guestOrCompany !== "guest",
      variant: "under_line",
      label: t("Guest"),
      containerClassName: "col-span-6",
      getOptions: (result) => {
        return result.data?.map((item: Guest) => ({
          label: item.user.name,
          value: item.user_id,
        }));
      },
      oneTimeFetchAction: () => get_guest({}),
    };
  },
}
```

## Dynamic Fields with Dependencies

### 1. Cascading Autocomplete Fields
```typescript
car_classes_ids: {
  yup: Yup.array()
    .of(
      Yup.object().shape({
        value: Yup.number(),
        label: Yup.string(),
      })
    )
    .required(t("Validation.Required")),
  type: "autocomplete-dependencies-fetch",
  component: AutocompleteFieldDependenciesFetch,
  componentProps: ({ setValue, getValues }) => ({
    color: "#fff",
    required: true,
    multiple: true,
    variant: "under_line",
    label: t("Car Classes"),
    autoFocus: true,
    containerClassName: "sm:col-span-6",
    getOptions: (result: any) => {
      const data: VehicleClass[] = result.data;
      return data.map((item) => ({
        label: item.en_name,
        value: String(item.id),
      }));
    },
    onChange: async (value: any) => {
      const selectedIds = value.map((ob: any) => Number(ob.value));
      const newCategories = await get_cars_category_by_car_class(selectedIds);
      const options = newCategories.map((item: any) => ({
        label: item.en_name,
        value: item.id,
      }));
      
      const currentSelected = getValues("car_categories_ids") || [];
      const filteredSelected = currentSelected.filter((selected: any) =>
        options.some((option: any) => option.value === selected.value)
      );
      
      setValue("car_categories_ids", filteredSelected);
    },
    oneTimeFetchAction: async () => await get_vehicle_classes({}),
  }),
}
```

## Field Arrays

### 1. Dynamic Array Fields
```typescript
const fieldArray = useMemo(
  () =>
    prepareFieldArray(
      (FieldArrayProps) => {
        return {
          header: {
            type: "custom",
            fieldsToWatch: [`fieldArray.${FieldArrayProps?.index}.description`],
            component: () => {
              return (
                <div className="col-span-12 flex items-center justify-between gap-2">
                  <p>{FieldArrayProps?.index} {"array field"}</p>
                  <button
                    onClick={() => {
                      FieldArrayProps?.fieldArrayHooks.remove(FieldArrayProps?.index);
                    }}
                  >
                    {"Remove"}
                  </button>
                </div>
              );
            },
            componentProps: {},
          },
          title: {
            yup: Yup.string().required("Title is required"),
            type: "input",
            component: InputField,
            componentProps: {
              required: true,
              containerClassName: "col-span-12",
            },
          },
          description: {
            yup: Yup.string().required("Description is required"),
            type: "input",
            component: InputField,
            componentProps: {
              required: true,
              containerClassName: "col-span-12",
            },
          },
          addButton: {
            type: "custom",
            fieldsToWatch: [`fieldArray.${FieldArrayProps?.index}.description`],
            component: ({ WatchValues }) => {
              return (
                <div className="col-span-12">
                  <p>
                    {WatchValues[`fieldArray.${FieldArrayProps?.index}.description`]}
                  </p>
                  {FieldArrayProps?.index ===
                    (FieldArrayProps?.fieldArrayHooks.fields.length || 0) - 1 && (
                    <button
                      onClick={() => {
                        FieldArrayProps?.fieldArrayHooks.append({
                          title: "",
                          description: "",
                        });
                      }}
                    >
                      {"Add"}
                    </button>
                  )}
                </div>
              );
            },
            componentProps: {},
          },
        };
      },
      {
        HandleYup(schema) {
          return schema.required("fieldArray is required");
        },
        fieldsToWatch: ["name"],
      }
    ),
  []
);
```

## Form Configuration

### 1. Prepare Fields
```typescript
const fields = useMemo(
  () =>
    prepareFields({
      // ... all your field definitions
      fieldArray,
    }),
  [fieldArray, t]
);
```

### 2. Initialize Form Hooks
```typescript
const FormHooks = useFormBuilder(fields, {
  defaultValues: {
    name: "",
    country: "",
    terms: false,
    gender: "",
    birthDate: undefined,
    meetingTime: undefined,
    fieldArray: [
      {
        title: "",
        description: "",
      },
    ],
  },
});
```

### 3. Render Form
```typescript
return (
  <form
    onSubmit={FormHooks.handleSubmit((data) => {
      console.log(data);
    })}
  >
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12">
        <FormBuilder fields={fields} FormHooks={FormHooks} />
      </div>
      <div className="col-span-12">
        <button
          type="submit"
          className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          {"Submit"}
        </button>
      </div>
    </div>
  </form>
);
```

## Key Features

### 1. Validation
- Uses Yup for schema validation
- Supports conditional validation with `.when()`
- Custom validation rules

### 2. Field Dependencies
- `fieldsToWatch`: Watch other fields for changes
- `hidden`: Conditionally hide/show fields
- `dependencies`: Pass data to dependent fields

### 3. Dynamic Behavior
- Real-time field updates
- Cascading dropdowns
- Dynamic field arrays

### 4. Custom Components
- Support for custom field components
- Flexible component props
- Access to form hooks and values

### 5. Styling
- Tailwind CSS classes
- Responsive grid layout
- Custom styling options

## Best Practices

1. **Use useMemo** for field definitions to prevent unnecessary re-renders
2. **Handle async operations** properly in onChange callbacks
3. **Validate dependencies** before making API calls
4. **Use proper TypeScript types** for better development experience
5. **Keep field definitions organized** and well-documented
6. **Test form behavior** with different field combinations

## Common Patterns

### 1. Conditional Field Display
```typescript
componentProps: ({ watch }) => ({
  hidden: watch("dependentField") !== "expectedValue",
  // ... other props
})
```

### 2. Dynamic Options
```typescript
componentProps: ({ setValue, getValues }) => ({
  onChange: async (value) => {
    // Update dependent fields
    setValue("dependentField", newValue);
  },
  // ... other props
})
```

### 3. Field Watching
```typescript
fieldsToWatch: ["field1", "field2"],
componentProps: ({ WatchValues }) => ({
  // Use WatchValues.field1, WatchValues.field2
})
```

This FormBuilder system provides a powerful and flexible way to create complex forms with minimal boilerplate code while maintaining type safety and good performance.
