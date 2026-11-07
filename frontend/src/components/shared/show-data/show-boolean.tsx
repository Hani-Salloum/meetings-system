function ShowBoolean({
  value,
  center = true,
}: {
  value: boolean;
  center?: boolean;
}) {
  return (
    <div className={`flex ${center ? "items-center justify-center" : ""}`}>
      {value ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6 text-primary"
        >
          <path
            fillRule="evenodd"
            d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm4.93 7.62a1 1 0 00-1.41-.12l-4.32 3.76-1.88-1.64a1 1 0 10-1.3 1.52l2.5 2.17a1 1 0 001.32 0l5-4.35a1 1 0 00.12-1.34z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6 text-red-500"
        >
          <path
            fillRule="evenodd"
            d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm4.95 13.54a1 1 0 01-1.41 1.41L12 13.41l-3.54 3.54a1 1 0 01-1.41-1.41L10.59 12 7.05 8.46a1 1 0 011.41-1.41L12 10.59l3.54-3.54a1 1 0 011.41 1.41L13.41 12z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
  );
}

export default ShowBoolean;
