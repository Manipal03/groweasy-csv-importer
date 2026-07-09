interface UploadButtonProps {
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}

export default function UploadButton({
  loading,
  disabled,
  onClick,
}: UploadButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="mt-8 rounded-xl bg-green-600 px-8 py-3 text-white font-semibold hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? "Importing..." : "Import CSV"}
    </button>
  );
}