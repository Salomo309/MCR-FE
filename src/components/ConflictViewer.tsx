interface ConflictViewerProps {
  mergedContent: string[];
  hasConflict: boolean;
  onResolve: () => void;
}

export const ConflictViewer: React.FC<ConflictViewerProps> = ({ mergedContent, hasConflict, onResolve }) => {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Merged Result:</h2>
      <pre className="bg-gray-900 text-white p-4 rounded overflow-auto max-h-[400px] text-sm">
        {mergedContent.map((line, idx) => (
          <div
            key={idx}
            className={
              line.startsWith('<<<<<<<') || line.startsWith('=======') || line.startsWith('>>>>>>>')
                ? 'bg-red-600 text-white'
                : ''
            }
          >
            {line}
          </div>
        ))}
      </pre>
      {hasConflict && (
        <button
          onClick={onResolve}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Resolve Conflict
        </button>
      )}
    </div>
  );
};
