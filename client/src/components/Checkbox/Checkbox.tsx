// Switch component used on...

// TODO -

import * as CheckboxRadix from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import "./styles.scss";

type CheckboxProps = {
  label: string;
  id: string;
  onChange: (values: boolean) => void;
};

export default function Checkbox({ label, id, onChange }: CheckboxProps) {
  return (
    <div className="flex items-center">
      <CheckboxRadix.Root
        className="CheckboxRoot"
        defaultChecked
        id={id}
        onCheckedChange={onChange}
      >
        <CheckboxRadix.Indicator className="CheckboxIndicator">
          <CheckIcon />
        </CheckboxRadix.Indicator>
      </CheckboxRadix.Root>
      <label className="pl-2 cursor-pointer" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
