// Switch component used on...

// TODO -

import * as SwitchRadix from "@radix-ui/react-switch";
import "./styles.scss";

type SwitchProps = {
  label: string;
  id: string;
  onChange: (values: boolean) => void;
};

export default function Switch({ label, id, onChange }: SwitchProps) {
  return (
    <div className="flex items-center">
      <label className="pr-2" htmlFor={id}>
        {label}
      </label>
      <SwitchRadix.Root
        className="SwitchRoot"
        id={id}
        onCheckedChange={onChange}
      >
        <SwitchRadix.Thumb className="SwitchThumb" />
      </SwitchRadix.Root>
    </div>
  );
}
