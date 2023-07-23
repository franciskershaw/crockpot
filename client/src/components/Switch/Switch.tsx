// Switch component used on Browse page - Recipe filter

// TODO - Styling (normal)

import * as SwitchRadix from "@radix-ui/react-switch";
import { v4 as uuidv4 } from "uuid";
import "./styles.scss";

type SwitchProps = {
  label: string;
  onChange: (values: boolean) => void;
};

export default function Switch({ label, onChange }: SwitchProps) {
  return (
    <div className="flex items-center">
      <label className="pr-2" htmlFor={uuidv4()}>
        {label}
      </label>
      <SwitchRadix.Root
        className="SwitchRoot"
        id={uuidv4()}
        onCheckedChange={onChange}
      >
        <SwitchRadix.Thumb className="SwitchThumb" />
      </SwitchRadix.Root>
    </div>
  );
}
