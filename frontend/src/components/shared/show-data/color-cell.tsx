export const ColorCell = ({ color }: { color: string }) => {
  return (
    <div
      style={{ backgroundColor: color }}
      className={`mx-auto flex h-8 w-8 rounded-full ${color}`}
    />
  );
};
