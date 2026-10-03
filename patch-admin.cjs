const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanelPage.tsx', 'utf8');
code = code.replace(`import { AdminAuthLock } from './AdminAuthLock';`, `import { AdminAuthLock } from './AdminAuthLock';\nimport { ConfirmModal } from './ConfirmModal';`);

code = code.replace(/const \[activeTab, setActiveTab\] = useState/, `const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, title: string, message: string, onConfirm: () => void} | null>(null);\n  const [activeTab, setActiveTab] = useState`);

const origCode = `    if (window.confirm(\`Are you sure you want to remove "\${destName}" destination hub? This will update all packages and circuits.\`)) {
      const next = destinations.filter(d => d.id !== id);
      setDestinations(next);
      firestoreService.saveCatalog('destinations', next);
    }`;

const newCode = `    setConfirmModal({
      isOpen: true,
      title: 'Remove Destination',
      message: \`Are you sure you want to remove "\${destName}" destination hub? This will update all packages and circuits.\`,
      onConfirm: () => {
        setConfirmModal(null);
        const next = destinations.filter(d => d.id !== id);
        setDestinations(next);
        firestoreService.saveCatalog('destinations', next);
      }
    });`;

code = code.replace(origCode, newCode);

const modalJSX = `\n      {confirmModal && <ConfirmModal isOpen={confirmModal.isOpen} title={confirmModal.title} message={confirmModal.message} danger={true} onCancel={() => setConfirmModal(null)} onConfirm={confirmModal.onConfirm} />}\n    </div>`;
code = code.replace(/\n\s*<\/div>\n\s*\);\n\};\n*$/, modalJSX + '\n  );\n};\n');

fs.writeFileSync('src/components/AdminPanelPage.tsx', code);
