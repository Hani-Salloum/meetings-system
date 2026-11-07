# FormDialog with Hook - Usage Guide

## Overview

`FormDialog` with `useFormDialog` Hook provides a simple and powerful way to create forms in modal dialogs with smart state management.

## Features

- ✅ **Smart State Management**: `useFormDialog` manages everything automatically
- ✅ **Simple Usage**: `{...formDialog.dialogProps}` passes all data
- ✅ **Edit/Add Support**: Automatic text and state changes
- ✅ **TypeScript Types**: Automatic inference from `prepareFields`
- ✅ **Full Integration**: With `FormBuilder` and `BaseDialog`

## Basic Usage

### 1. Define Fields

```tsx
import AutocompleteField from "@/components/FormBuilder/FormFields/autocomplete-field";
import InputField from "@/components/FormBuilder/FormFields/input-field";
import { prepareFields } from "@/components/FormBuilder/utils/prepare-fields";
import Yup from "@/components/FormBuilder/utils/yup";

const userFields = prepareFields({
  name: {
    yup: Yup.string().required("Name is required"),
    type: "input" as const,
    component: InputField,
    componentProps: {
      label: "Name",
      placeholder: "Enter name",
      required: true,
      containerClassName: "col-span-6",
    },
  },
  email: {
    yup: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    type: "email" as const,
    component: InputField,
    componentProps: {
      label: "Email",
      placeholder: "Enter email",
      type: "email",
      required: true,
      containerClassName: "col-span-6",
    },
  },
  role: {
    yup: Yup.string().required("Role is required"),
    type: "autocomplete" as const,
    component: AutocompleteField,
    componentProps: {
      label: "Role",
      placeholder: "Select role",
      required: true,
      containerClassName: "col-span-6",
      options: [
        { value: "admin", label: "Admin" },
        { value: "user", label: "User" },
        { value: "moderator", label: "Moderator" },
      ],
    },
  },
  phone: {
    yup: Yup.string(), // optional
    type: "input" as const,
    component: InputField,
    componentProps: {
      label: "Phone Number",
      placeholder: "Enter phone number",
      type: "tel",
      containerClassName: "col-span-6",
    },
  },
});
```

### 2. Use useFormDialog Hook

```tsx
import {
  FormDialog,
  useFormDialog,
} from "@/components/common/dialog/form-dialog";

function UserManagement() {
  const formDialog = useFormDialog(userFields, {
    defaultValues: {
      name: "",
      email: "",
      role: "",
      phone: "",
    },
    onSubmit: async (data) => {
      console.log("Form data:", data);
      // Save data...
      await saveUser(data);
    },
    title: "User Management",
    submitText: "Save",
    cancelText: "Cancel",
    size: "lg",
    formOptions: {
      mode: "onBlur",
      shouldFocusError: true,
    },
  });

  return (
    <div>
      {/* Control buttons */}
      <button onClick={formDialog.openAdd}>Add New User</button>

      {/* FormDialog - Simple usage */}
      <FormDialog {...formDialog.dialogProps} />
    </div>
  );
}
```

## Advanced Examples

### Example 1: Complete User Management

```tsx
function UserManagementComplete() {
  const formDialog = useFormDialog(userFields, {
    defaultValues: {
      name: "",
      email: "",
      role: "",
      phone: "",
    },
    onSubmit: async (data) => {
      try {
        if (formDialog.isEditMode) {
          await updateUser(formDialog.editingData?.id, data);
          console.log("User updated successfully");
        } else {
          await createUser(data);
          console.log("User created successfully");
        }
      } catch (error) {
        console.error("Error saving data:", error);
      }
    },
    title: "User Management",
    submitText: "Save",
    cancelText: "Cancel",
    size: "lg",
  });

  // Sample data
  const sampleUsers = [
    {
      id: 1,
      name: "Ahmed Mohamed",
      email: "ahmed@example.com",
      role: "user",
      phone: "0123456789",
    },
    {
      id: 2,
      name: "Fatima Ali",
      email: "fatima@example.com",
      role: "admin",
      phone: "0987654321",
    },
  ];

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-bold">User Management</h1>

      {/* Control buttons */}
      <div className="flex gap-2">
        <button
          onClick={formDialog.openAdd}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Add New User
        </button>

        <button
          onClick={() => formDialog.openEdit(sampleUsers[0])}
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          Edit Ahmed Mohamed
        </button>

        <button
          onClick={() => formDialog.openEdit(sampleUsers[1])}
          className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
        >
          Edit Fatima Ali
        </button>
      </div>

      {/* Dialog status display */}
      <div className="rounded bg-gray-100 p-4">
        <h3 className="mb-2 font-semibold">Dialog Status:</h3>
        <p>Open: {formDialog.isOpen ? "Yes" : "No"}</p>
        <p>Edit Mode: {formDialog.isEditMode ? "Yes" : "No"}</p>
        <p>Title: {formDialog.title}</p>
        <p>Button Text: {formDialog.submitText}</p>
        {formDialog.editingData && (
          <p>Editing Data: {formDialog.editingData.name}</p>
        )}
      </div>

      {/* FormDialog with custom content */}
      <FormDialog
        {...formDialog.dialogProps}
        beforeForm={
          <div className="mb-4 rounded bg-blue-50 p-3 text-sm text-blue-700">
            {formDialog.isEditMode ? (
              <p>Edit user data: {formDialog.editingData?.name}</p>
            ) : (
              <p>Enter new user data</p>
            )}
          </div>
        }
        afterForm={
          <div className="mt-4 rounded bg-gray-50 p-3 text-sm text-gray-600">
            <p>* Required fields are marked with (*)</p>
            <p>* Email validation will be performed</p>
          </div>
        }
      />
    </div>
  );
}
```

### Example 2: Form with Custom Buttons

```tsx
function UserFormWithCustomButtons() {
  const formDialog = useFormDialog(userFields, {
    defaultValues: {
      name: "",
      email: "",
      role: "",
      phone: "",
    },
    onSubmit: async (data) => {
      console.log("Saving data:", data);
      await saveUser(data);
    },
    title: "Form with Custom Buttons",
  });

  const handleDelete = () => {
    if (formDialog.editingData?.id) {
      deleteUser(formDialog.editingData.id);
      formDialog.close();
    }
  };

  const handlePreview = () => {
    console.log("Preview data:", formDialog.editingData);
  };

  return (
    <div>
      <button onClick={formDialog.openAdd}>Open Custom Form</button>

      <FormDialog
        {...formDialog.dialogProps}
        customButtons={
          <div className="flex gap-2">
            <button
              onClick={formDialog.close}
              className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            >
              Cancel
            </button>
            {formDialog.isEditMode && (
              <>
                <button
                  onClick={handlePreview}
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Preview
                </button>
                <button
                  onClick={handleDelete}
                  className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </>
            )}
            <button
              onClick={() => {
                // Call onSubmit from formDialog
                formDialog.onSubmit(
                  formDialog.editingData || formDialog.defaultValues
                );
              }}
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              {formDialog.isEditMode ? "Update" : "Save"}
            </button>
          </div>
        }
      />
    </div>
  );
}
```

### Example 3: Advanced Form with Many Options

```tsx
function AdvancedUserForm() {
  const formDialog = useFormDialog(userFields, {
    defaultValues: {
      name: "",
      email: "",
      role: "",
      phone: "",
    },
    onSubmit: async (data) => {
      console.log("Advanced form data:", data);
      await saveUser(data);
    },
    title: "Advanced Form",
    submitText: "Save Changes",
    cancelText: "Cancel",
    size: "xl",
    formOptions: {
      mode: "onChange",
      reValidateMode: "onBlur",
      shouldFocusError: true,
      criteriaMode: "all",
    },
  });

  return (
    <div>
      <button onClick={formDialog.openAdd}>Open Advanced Form</button>

      <FormDialog
        {...formDialog.dialogProps}
        fullScreen={false}
        hideDividers={false}
        preventCloseOnOutsideClick={true}
        formClassName="grid grid-cols-12 gap-6"
        enableDevTools={true}
        beforeForm={
          <div className="mb-6 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4">
            <h3 className="mb-2 text-lg font-semibold text-blue-800">
              Advanced Form
            </h3>
            <p className="text-sm text-blue-600">
              This is an example of an advanced form with many options and full
              customization
            </p>
          </div>
        }
        afterForm={
          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <h4 className="mb-2 font-semibold text-gray-800">Notes:</h4>
            <ul className="text-sm text-gray-600">
              <li>• All required fields are marked with (*)</li>
              <li>• Email validation will be performed</li>
              <li>• Phone number is optional</li>
              <li>• Real-time validation is enabled</li>
            </ul>
          </div>
        }
      />
    </div>
  );
}
```

## API Reference

### useFormDialog Hook

#### Parameters

```tsx
useFormDialog<T>(fields: T, options: FormDialogOptions<T>)
```

#### Return Value

```tsx
{
  // Dialog state
  isOpen: boolean;
  isEditMode: boolean;
  editingData: InferFormValuesType<T> | null;

  // Texts
  title: string;
  submitText: string;
  cancelText: string;
  size: string;

  // Functions
  openAdd: () => void;
  openEdit: (data: InferFormValuesType<T>) => void;
  open: (data?: Partial<InferFormValuesType<T>>) => void;
  close: () => void;
  reset: () => void;

  // Submit function
  onSubmit: (data: InferFormValuesType<T>) => void | Promise<void>;

  // Default values
  defaultValues: Partial<InferFormValuesType<T>>;

  // Form options
  formOptions: object;

  // Aggregated data for FormDialog
  dialogProps: {
    fields: T;
    options: FormDialogOptions<T>;
    isOpen: boolean;
    onClose: () => void;
    editingData: InferFormValuesType<T> | null;
    isEditMode: boolean;
  };
}
```

### FormDialogOptions

```tsx
interface FormDialogOptions<T> {
  defaultValues?: Partial<InferFormValuesType<T>>;
  onSubmit: (data: InferFormValuesType<T>) => void | Promise<void>;
  title?: string;
  submitText?: string;
  cancelText?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  formOptions?: {
    mode?: "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all";
    reValidateMode?: "onBlur" | "onChange" | "onSubmit";
    criteriaMode?: "firstError" | "all";
    shouldFocusError?: boolean;
    shouldUnregister?: boolean;
    shouldUseNativeValidation?: boolean;
    delayError?: number;
  };
}
```

## Best Practices

1. **Use prepareFields**: For the best type support
2. **Define default values**: For all required fields
3. **Use dialogProps**: To avoid repetition in data passing
4. **Handle errors**: In the onSubmit function
5. **Use correct types**: With `as const` for fields
6. **Add custom content**: To improve user experience
7. **Use custom buttons**: When additional functions are needed

## Troubleshooting

### Issue: Type errors

```tsx
// ❌ Wrong
const fields = {
  name: { type: "input", component: InputField }
};

// ✅ Correct
const fields = prepareFields({
  name: {
    type: "input" as const,
    component: InputField,
    yup: Yup.string().required(),
    componentProps: { label: "Name" }
  }
});
```

### Issue: Dialog not closing

```tsx
// ❌ Wrong
const handleSubmit = async (data) => {
  await saveData(data);
  // Dialog doesn't close automatically
};

// ✅ Correct
const handleSubmit = async (data) => {
  try {
    await saveData(data);
    // Dialog closes automatically on success
  } catch (error) {
    // Dialog stays open on error
    console.error(error);
  }
};
```

### Issue: Form not updating

```tsx
// ❌ Wrong
const [defaultValues, setDefaultValues] = useState({});

// ✅ Correct
const formDialog = useFormDialog(userFields, {
  defaultValues: { name: "", email: "" },
  onSubmit: handleSubmit,
});
```

## Summary

`FormDialog` with `useFormDialog` Hook provides an excellent experience for creating modal forms:

- **Simple usage**: `{...formDialog.dialogProps}` passes everything
- **Smart state management**: Automatic text and state changes
- **Full TypeScript support**: Types work perfectly
- **Flexible customization**: Ability to add custom content and buttons
- **Perfect integration**: With `FormBuilder` and `BaseDialog`

This design makes creating modal forms simple and enjoyable! 🎉
