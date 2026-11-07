/**
 * Utility functions for handling nested data path extraction
 * Provides flexible data access patterns for API responses
 */

export interface DataPathOptions {
  /**
   * The path to extract data from (supports dot notation)
   * @example "data.items" or "results"
   */
  path: string;

  /**
   * The source object to extract from
   */
  source: any;

  /**
   * Default value to return if path doesn't exist
   */
  defaultValue?: any;

  /**
   * Whether to ensure the result is always an array
   */
  ensureArray?: boolean;

  /**
   * Transform function to apply to each item
   */
  transform?: (item: any, index: number) => any;

  /**
   * Filter function to apply to items
   */
  filter?: (item: any, index: number) => boolean;
}

/**
 * Extract data from nested object using dot notation
 *
 * @param path - Dot-separated path (e.g., "data.items")
 * @param source - Source object
 * @param defaultValue - Default value if path doesn't exist
 * @returns The value at the specified path or default value
 *
 * @example
 * ```typescript
 * const data = { user: { profile: { name: "John" } } };
 * const name = getNestedValue(data, "user.profile.name", "Unknown");
 * // Returns: "John"
 * ```
 */
export function getNestedValue(
  source: any,
  path: string,
  defaultValue: any = undefined
): any {
  if (!source || !path) return defaultValue;

  const keys = path.split(".");
  let current = source;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return defaultValue;
    }
    current = current[key];
  }

  return current !== undefined ? current : defaultValue;
}

/**
 * Extract and process data from API responses with enhanced options
 *
 * @param options - Configuration options for data extraction
 * @returns Processed data array or single value
 *
 * @example
 * ```typescript
 * const users = extractDataFromResponse({
 *   path: "data.users",
 *   source: apiResponse,
 *   ensureArray: true,
 *   transform: (user) => ({ ...user, fullName: `${user.firstName} ${user.lastName}` }),
 *   filter: (user) => user.isActive
 * });
 * ```
 */
export function extractDataFromResponse(options: DataPathOptions): any[] {
  const {
    path,
    source,
    defaultValue = [],
    ensureArray = true,
    transform,
    filter,
  } = options;

  // Extract data using path
  let data = getNestedValue(source, path, defaultValue);

  // Ensure it's an array if requested
  if (ensureArray && !Array.isArray(data)) {
    data = data !== undefined && data !== null ? [data] : [];
  }

  // Apply filter if provided
  if (filter && Array.isArray(data)) {
    data = data.filter(filter);
  }

  // Apply transform if provided
  if (transform && Array.isArray(data)) {
    data = data.map(transform);
  }

  return Array.isArray(data) ? data : [];
}

/**
 * Legacy function for backward compatibility
 * Maintains the original HandlePathData interface
 *
 * @param dataKey - The key or dot-separated path to extract
 * @param response - The API response object
 * @returns Array of data
 */
export function HandlePathData({
  dataKey,
  response,
}: {
  dataKey: string;
  response: any;
}): any[] {
  return extractDataFromResponse({
    path: dataKey,
    source: response,
    ensureArray: true,
  });
}

/**
 * Extract multiple data paths from a single response
 *
 * @param paths - Object with path names as keys and paths as values
 * @param source - Source object
 * @returns Object with extracted data
 *
 * @example
 * ```typescript
 * const extracted = extractMultiplePaths({
 *   users: "data.users",
 *   total: "data.total",
 *   metadata: "data.metadata"
 * }, apiResponse);
 * ```
 */
export function extractMultiplePaths(
  paths: Record<string, string>,
  source: any
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, path] of Object.entries(paths)) {
    result[key] = getNestedValue(source, path);
  }

  return result;
}

/**
 * Safely extract pagination data from API responses
 *
 * @param response - API response object
 * @param keys - Object with pagination key names
 * @returns Pagination data with fallbacks
 */
export function extractPaginationData(
  response: any,
  keys: {
    pageKey?: string;
    totalKey?: string;
    totalPagesKey?: string;
    pageSizeKey?: string;
  } = {}
): {
  page: number;
  total: number;
  totalPages: number;
  pageSize: number;
} {
  const {
    pageKey = "page",
    totalKey = "total",
    totalPagesKey = "total_pages",
    pageSizeKey = "pagesize",
  } = keys;

  return {
    page: getNestedValue(response, pageKey, 1),
    total: getNestedValue(response, totalKey, 0),
    totalPages: getNestedValue(response, totalPagesKey, 0),
    pageSize: getNestedValue(response, pageSizeKey, 10),
  };
}

/**
 * Type-safe data extraction with validation
 *
 * @param path - Data path
 * @param source - Source object
 * @param validator - Function to validate extracted data
 * @returns Validated data or null
 */
export function extractWithValidation<T>(
  path: string,
  source: any,
  validator: (data: any) => data is T
): T | null {
  const data = getNestedValue(source, path);
  return validator(data) ? data : null;
}
