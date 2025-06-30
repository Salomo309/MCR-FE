import { useState } from 'react';
import { FileInput } from './components/FileInput';
import { ConflictViewer } from './components/ConflictViewer';

function App() {
  const [base, setBase] = useState('');
  const [local, setLocal] = useState('');
  const [remote, setRemote] = useState('');
  const [merged, setMerged] = useState<string[]>([]);
  const [hasConflict, setHasConflict] = useState(false);

  const detectConflict = () => {
    if (!base || !local || !remote) return;

    // Simulasi merge conflict (dummy)
    const dummyConflict = [
      'def hello():',
      '<<<<<<< LOCAL',
      '    print("Hello from local")',
      '=======',
      '    print("Hello from remote")',
      '>>>>>>> REMOTE',
    ];

    setMerged(dummyConflict);
    setHasConflict(true);
  };

  const resolveConflict = () => {
    // Dummy resolved version
    const resolved = [
      'def hello():',
      '    print("Hello from local and remote")',
    ];
    setMerged(resolved);
    setHasConflict(false);
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
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Detect Conflict
        </button>
      </div>

      <div className="w-1/2">
        {merged.length > 0 && (
          <ConflictViewer mergedContent={merged} hasConflict={hasConflict} onResolve={resolveConflict} />
        )}
      </div>
    </div>
  );
}

export default App;
