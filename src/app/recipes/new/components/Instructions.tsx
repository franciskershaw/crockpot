import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Reorder, useDragControls } from "motion/react";
import { useRef, useState, useEffect } from "react";

export interface Instruction {
  id: string;
  text: string;
}

interface InstructionsProps {
  instructions: Instruction[];
  setInstructions: (
    instructions: Instruction[] | ((prev: Instruction[]) => Instruction[])
  ) => void;
}

interface InstructionItemProps {
  instruction: Instruction;
  index: number;
  onUpdate: (id: string, text: string) => void;
  onRemove: (id: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  canRemove: boolean;
  constraintsRef: React.RefObject<HTMLDivElement | null>;
  shouldFocus: boolean;
}

const InstructionItem = ({
  instruction,
  index,
  onUpdate,
  onRemove,
  onKeyDown,
  canRemove,
  constraintsRef,
  shouldFocus,
}: InstructionItemProps) => {
  const controls = useDragControls();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shouldFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [shouldFocus]);

  return (
    <Reorder.Item
      value={instruction}
      className="flex flex-row gap-3 items-start"
      dragListener={false}
      dragControls={controls}
      dragConstraints={constraintsRef}
    >
      <div className="flex-shrink-0 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
        {index + 1}
      </div>
      <div className="flex-1 w-full">
        <Input
          ref={inputRef}
          value={instruction.text}
          onChange={(e) => onUpdate(instruction.id, e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={`Step ${
            index + 1
          } instruction. Press Enter to add a new step...`}
          className="w-full"
        />
      </div>
      <div className="flex items-center gap-2 self-start">
        <button
          type="button"
          className="p-1 hover:bg-gray-200 rounded transition-colors cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => controls.start(e)}
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(instruction.id)}
          disabled={!canRemove}
          className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Reorder.Item>
  );
};

const Instructions = ({ instructions, setInstructions }: InstructionsProps) => {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);

  const addInstruction = () => {
    const newId = crypto.randomUUID();
    setInstructions((prev) => [...prev, { id: newId, text: "" }]);
    setNewlyAddedId(newId);
  };

  const removeInstruction = (id: string) => {
    if (instructions.length > 1) {
      setInstructions((prev) => prev.filter((inst) => inst.id !== id));
    }
  };

  const updateInstruction = (id: string, text: string) => {
    setInstructions((prev) =>
      prev.map((inst) => (inst.id === id ? { ...inst, text } : inst))
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addInstruction();
    }
  };

  return (
    <div className="space-y-3">
      <FormLabel>Instructions* </FormLabel>
      <div
        ref={constraintsRef}
        className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative overflow-hidden"
      >
        <Reorder.Group
          values={instructions}
          onReorder={setInstructions}
          className="space-y-3"
          axis="y"
        >
          {instructions.map((instruction, index) => (
            <InstructionItem
              key={instruction.id}
              instruction={instruction}
              index={index}
              onUpdate={updateInstruction}
              onRemove={removeInstruction}
              onKeyDown={handleKeyDown}
              canRemove={instructions.length > 1}
              constraintsRef={constraintsRef}
              shouldFocus={newlyAddedId === instruction.id}
            />
          ))}
        </Reorder.Group>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addInstruction}
        className=""
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Step
      </Button>
    </div>
  );
};

export default Instructions;
