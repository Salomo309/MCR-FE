import { useState } from 'react';
import { FileInput } from './components/FileInput';
import { ConflictViewer } from './components/ConflictViewer';
import { diff3Merge, type MergeRegion } from 'node-diff3';

function App() {
  const [base, setBase] = useState('');
  const [local, setLocal] = useState('');
  const [remote, setRemote] = useState('');
  const [conflictContent, setConflictContent] = useState<string[]>([]);
  const [hasConflict, setHasConflict] = useState(false);
  const [resolvedContent, setResolvedContent] = useState<string[]>([]);

  const detectConflict = () => {
    if (!base || !local || !remote) return;

    const baseLines = base.split('\n');
    const localLines = local.split('\n');
    const remoteLines = remote.split('\n');

    const result = diff3Merge(localLines, baseLines, remoteLines);

    const merged: string[] = [];

    result.forEach((part: MergeRegion<string>) => {
      if (part.ok) {
        merged.push(...part.ok);
      } else if (part.conflict) {
        merged.push('<<<<<<< LOCAL');
        merged.push(...part.conflict.a);
        merged.push('=======');
        merged.push(...part.conflict.b);
        merged.push('>>>>>>> REMOTE');
      }
    });

    setConflictContent(merged);
    setHasConflict(merged.some(line => line.startsWith('<<<<<<<')));
    setResolvedContent([]);
  };

  const resolveConflict = () => {
    const resolved = conflictContent.filter(
      line =>
        !line.startsWith('<<<<<<<') &&
        !line.startsWith('=======') &&
        !line.startsWith('>>>>>>>')
    );
    setResolvedContent(resolved);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-start py-10 px-4">
      <div className="w-1/2 max-w-md pr-8">
        <h1 className="text-3xl font-bold mb-8">Merge Conflict Detector</h1>
        <FileInput label="Base Version" onFileChange={setBase} />
        <FileInput label="Local Version" onFileChange={setLocal} />
        <FileInput label="Remote Version" onFileChange={setRemote} />
        <button
          onClick={detectConflict}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Detect Conflict
        </button>
      </div>

      <div className="w-1/2">
        {conflictContent.length > 0 && resolvedContent.length === 0 && (
          <ConflictViewer
            mergedContent={conflictContent}
            hasConflict={hasConflict}
            onResolve={resolveConflict}
          />
        )}

        {resolvedContent.length > 0 && (
          <div className="bg-gray-900 p-4 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Resolved Result:</h2>
            <pre className="bg-gray-800 text-white p-4 rounded overflow-auto max-h-[500px] text-sm">
              {resolvedContent.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
