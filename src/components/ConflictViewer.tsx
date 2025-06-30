interface ConflictViewerProps {
  mergedContent: string[];
  hasConflict: boolean;
  onResolve: () => void;
  isResolving?: boolean;
}

export const ConflictViewer: React.FC<ConflictViewerProps> = ({
  mergedContent,
  hasConflict,
  isResolving,
  onResolve,
}) => {
  const getLineClass = (line: string) => {
    if (line.startsWith('<<<<<<<')) return 'bg-red-700 font-bold text-white';
    if (line.startsWith('=======')) return 'bg-red-600 text-white';
    if (line.startsWith('>>>>>>>')) return 'bg-red-700 font-bold text-white';
    return '';
  };
  return (
    <div className="bg-gray-900 p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Merged Result:</h2>
      <pre className="bg-gray-800 text-white p-4 rounded overflow-auto max-h-[500px] text-sm">
        {mergedContent.map((line, idx) => (
          <div key={idx} className={getLineClass(line)}>
            {line}
          </div>
        ))}
      </pre>
      {hasConflict && (
        <button
          onClick={onResolve}
          disabled={isResolving}
          className={`mt-4 ${
            isResolving ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-bold py-2 px-4 rounded`}
        >
          Resolve Conflict
        </button>
      )}
    </div>
  );
};

