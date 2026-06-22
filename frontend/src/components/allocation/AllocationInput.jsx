import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlinePlus, HiOutlineX } from "react-icons/hi";

function EditableList({ title, items, setItems, prefix, sizeLabel = "Size" }) {
  const addItem = () => {
    setItems((prev) => [...prev, { id: `${prefix}${prev.length + 1}`, size: 100, _key: Date.now() + Math.random() }]);
  };
  const removeItem = (key) => {
    setItems((prev) => prev.filter((it) => it._key !== key));
  };
  const updateItem = (key, field, value) => {
    setItems((prev) =>
      prev.map((it) => (it._key === key ? { ...it, [field]: field === "id" ? value : Math.max(1, Number(value)) } : it))
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{title}</h3>
        <button onClick={addItem} className="btn-ghost text-xs flex items-center gap-1">
          <HiOutlinePlus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
      <div className="space-y-2">
        <AnimatePresence>
          {items.map((it) => (
            <motion.div
              key={it._key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-2"
            >
              <input className="input-field w-20" value={it.id} onChange={(e) => updateItem(it._key, "id", e.target.value)} />
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{sizeLabel}:</span>
              <input type="number" min="1" className="input-field flex-1" value={it.size} onChange={(e) => updateItem(it._key, "size", e.target.value)} />
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>KB</span>
              <button onClick={() => removeItem(it._key)} disabled={items.length <= 1} style={{ color: "var(--text-muted)" }} className="disabled:opacity-20">
                <HiOutlineX className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function AllocationInput({ blocks, setBlocks, processes, setProcesses }) {
  const loadExample = () => {
    setBlocks([
      { id: "B1", size: 100, _key: 1 },
      { id: "B2", size: 500, _key: 2 },
      { id: "B3", size: 200, _key: 3 },
      { id: "B4", size: 300, _key: 4 },
      { id: "B5", size: 600, _key: 5 },
    ]);
    setProcesses([
      { id: "P1", size: 212, _key: 11 },
      { id: "P2", size: 417, _key: 12 },
      { id: "P3", size: 112, _key: 13 },
      { id: "P4", size: 426, _key: 14 },
    ]);
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="section-label">Input</p>
          <h2 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>Memory Blocks & Processes</h2>
        </div>
        <button onClick={loadExample} className="btn-ghost text-xs">Load Example</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <EditableList title="Memory Blocks" items={blocks} setItems={setBlocks} prefix="B" />
        <EditableList title="Processes" items={processes} setItems={setProcesses} prefix="P" sizeLabel="Needs" />
      </div>
    </div>
  );
}
