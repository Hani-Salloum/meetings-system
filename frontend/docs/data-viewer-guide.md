# Data Viewer Dialog System - Usage Guide

## Overview

The Data Viewer Dialog System provides a flexible way to display different types of data in modal dialogs using the Strategy Pattern. It automatically detects data types and renders appropriate viewers, with support for multiple variants and custom configurations.

## Features

- ✅ **Strategy Pattern**: Different viewers for different data types
- ✅ **Auto Detection**: Automatically detects data type and appropriate viewer
- ✅ **Multiple Variants**: Each data type supports multiple display variants
- ✅ **Extensible**: Easy to add new data types and variants
- ✅ **Customizable**: Configurable display options for each viewer
- ✅ **Media Support**: Built-in support for images and videos
- ✅ **TypeScript**: Full type safety and IntelliSense support

## Supported Data Types

### Primitive Types

- **String**: Text, code, centered, bold variants
- **Number**: Number, currency, percentage, decimal variants
- **Boolean**: Icon, text, badge, success variants

### Complex Types

- **Array**: List, table, cards, compact variants
- **Object**: Key-value, table, cards, JSON variants

### Media Types

- **Image**: Thumbnail, full, gallery variants
- **Video**: Thumbnail, player, gallery variants

## Basic Usage

### 1. Import the Components

```tsx
import {
  DataViewerDialog,
  dataViewerHelpers,
  useDataViewerDialog,
} from "@/components/common/dialog/data-viewer";
```

### 2. Use the Hook

```tsx
function MyComponent() {
  const dataViewer = useDataViewerDialog();

  return (
    <div>
      {/* Your content */}

      {/* Data Viewer Dialog */}
      <DataViewerDialog {...dataViewer.dialogProps} />
    </div>
  );
}
```

### 3. Open Different Data Types

```tsx
// String data
dataViewerHelpers.openString(dataViewer.open, "Hello World");

// Number data
dataViewerHelpers.openNumber(dataViewer.open, 1234.56);

// Boolean data
dataViewerHelpers.openBoolean(dataViewer.open, true);

// Array data
dataViewerHelpers.openArray(dataViewer.open, ["item1", "item2", "item3"]);

// Object data
dataViewerHelpers.openObject(dataViewer.open, { name: "John", age: 30 });

// Image data
dataViewerHelpers.openImage(dataViewer.open, "https://example.com/image.jpg");

// Video data
dataViewerHelpers.openVideo(dataViewer.open, "https://example.com/video.mp4");

// Auto detection
dataViewerHelpers.openAuto(dataViewer.open, anyData);
```

## Advanced Usage

### Custom Configuration

```tsx
// String with custom config
dataViewerHelpers.openString(dataViewer.open, "Long text...", {
  variant: "text",
  config: {
    maxLength: 50,
    align: "center",
    fontWeight: "bold",
  },
  label: "Custom Label",
  showLabel: true,
  required: true,
});

// Number as currency
dataViewerHelpers.openNumber(dataViewer.open, 1234.56, {
  variant: "currency",
  config: {
    currency: "EUR",
    decimals: 2,
  },
  label: "Price",
});

// Array as table
dataViewerHelpers.openArray(dataViewer.open, userArray, {
  variant: "table",
  config: {
    maxItems: 10,
    showCount: true,
    collapsible: true,
  },
  label: "Users",
});
```

### Custom Dialog Configuration

```tsx
<DataViewerDialog
  {...dataViewer.dialogProps}
  title="Custom Title"
  size="xl"
  beforeContent={
    <div className="rounded bg-blue-50 p-3">
      <p>Custom content before the data</p>
    </div>
  }
  afterContent={
    <div className="rounded bg-gray-50 p-3">
      <p>Custom content after the data</p>
    </div>
  }
  actionButtons={<Button onClick={dataViewer.close}>Close</Button>}
/>
```

## Adding New Data Types

### 1. Create a Viewer Component

```tsx
// src/components/common/dialog/data-viewer/variants/custom/my-viewer.tsx
import { DataViewerProps } from "../../types";

interface MyViewerProps extends DataViewerProps<MyDataType> {
  config?: {
    // Your custom config options
  };
}

export function MyViewer({
  data,
  className = "",
  config = {},
  showLabel = true,
  label,
  required = false,
}: MyViewerProps) {
  // Your viewer implementation
  return <div className={className}>{/* Your viewer content */}</div>;
}
```

### 2. Register in Supported Types

```tsx
// src/components/common/dialog/data-viewer/supported-types.ts
import { MyViewer } from "./variants/custom/my-viewer";

const supportedTypes: SupportedTypes = {
  // ... existing types

  myType: {
    defaultVariant: "default",
    default: {
      component: MyViewer,
      defaultConfig: {
        // Your default config
      },
      supports: (data: any) => {
        // Your data type detection logic
        return typeof data === "myType";
      },
    },
    custom: {
      component: MyViewer,
      defaultConfig: {
        // Custom variant config
      },
      supports: (data: any) => {
        return typeof data === "myType";
      },
    },
  },
};
```

### 3. Add Helper Function (Optional)

```tsx
// src/components/common/dialog/data-viewer/use-data-viewer-dialog.tsx
export const dataViewerHelpers = {
  // ... existing helpers

  openMyType: (
    open: (data: DataViewerDialogData) => void,
    data: MyDataType,
    options?: {
      variant?: string;
      config?: Record<string, any>;
      showLabel?: boolean;
      label?: string;
      required?: boolean;
    }
  ) => {
    open({
      data,
      type: "myType",
      variant: options?.variant,
      config: options?.config,
      showLabel: options?.showLabel ?? true,
      label: options?.label,
      required: options?.required ?? false,
    });
  },
};
```

## Factory Methods

### Get Available Types

```tsx
import { dataViewerFactory } from "@/components/common/dialog/data-viewer";

const availableTypes = dataViewerFactory.getAvailableTypes();
// ["string", "number", "boolean", "array", "object", "image", "video"]

const stringVariants = dataViewerFactory.getAvailableVariants("string");
// ["text", "code", "centered", "bold"]
```

### Add Custom Types at Runtime

```tsx
// Add a new variant to existing type
dataViewerFactory.addVariant("string", "custom", {
  component: CustomStringViewer,
  defaultConfig: { /* config */ },
  supports: (data) => typeof data === "string",
});

// Add a completely new type
dataViewerFactory.addType("customType", {
  defaultVariant: "default",
  default: {
    component: CustomTypeViewer,
    defaultConfig: { /* config */ },
    supports: (data) => /* detection logic */,
  },
});
```

## Configuration Options

### String Viewer

- `asCode`: Display as code block
- `maxLength`: Maximum length before truncating
- `showFullOnHover`: Show full text on hover
- `align`: Text alignment (left, center, right)
- `fontWeight`: Font weight (normal, medium, semibold, bold)

### Number Viewer

- `format`: Number format (number, currency, percentage, decimal)
- `currency`: Currency code for currency format
- `decimals`: Number of decimal places
- `showSeparator`: Show thousands separator
- `align`: Text alignment
- `fontWeight`: Font weight

### Boolean Viewer

- `style`: Display style (icon, text, badge)
- `trueText`: Custom text for true value
- `falseText`: Custom text for false value
- `colorScheme`: Color scheme (default, success, danger, warning)

### Array Viewer

- `style`: Display style (list, table, cards, compact)
- `maxItems`: Maximum items to show before collapsing
- `showCount`: Show item count
- `collapsible`: Allow expanding/collapsing
- `itemRenderer`: Custom renderer for array items
- `columns`: Columns configuration for table style

### Object Viewer

- `style`: Display style (key-value, table, cards, json)
- `maxProperties`: Maximum properties to show before collapsing
- `showCount`: Show property count
- `collapsible`: Allow expanding/collapsing
- `excludeProperties`: Properties to exclude
- `includeProperties`: Properties to include only
- `sortProperties`: Sort properties alphabetically

### Image Viewer

- `style`: Display style (thumbnail, full, gallery)
- `thumbnailSize`: Thumbnail size (sm, md, lg, xl)
- `maxWidth`: Maximum width for full display
- `showInfo`: Show image info
- `allowZoom`: Allow zooming
- `showLoading`: Show loading state

### Video Viewer

- `style`: Display style (thumbnail, player, gallery)
- `thumbnailSize`: Thumbnail size
- `maxWidth`: Maximum width for player display
- `showInfo`: Show video info
- `autoplay`: Autoplay video
- `showControls`: Show video controls
- `loop`: Loop video
- `muted`: Mute video
- `showLoading`: Show loading state

## Best Practices

1. **Use Auto Detection**: Let the system automatically detect data types when possible
2. **Choose Appropriate Variants**: Select variants that best represent your data
3. **Customize Configurations**: Use custom configs to improve user experience
4. **Add Labels**: Always provide meaningful labels for better UX
5. **Handle Large Data**: Use collapsible options for large arrays/objects
6. **Extend System**: Add custom types and variants for your specific needs

## Troubleshooting

### Issue: Viewer not rendering

- Check if the data type is supported
- Verify the variant exists for the data type
- Ensure the data matches the expected format

### Issue: Auto detection not working

- Check the `supports` function in the type definition
- Verify the data structure matches the detection logic
- Add custom detection logic if needed

### Issue: Custom viewer not working

- Ensure the component follows the `DataViewerProps` interface
- Check that the component is properly exported
- Verify the type registration in `supported-types.ts`

## Summary

The Data Viewer Dialog System provides a powerful and flexible way to display various data types in modal dialogs. With its strategy pattern implementation, automatic type detection, and extensive customization options, it's easy to create rich data viewing experiences for your users.
