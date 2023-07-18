// Switch component used on...

// TODO -

import * as SwitchRadix from "@radix-ui/react-switch";
import "./styles.scss";

type SwitchProps = {
  label: string;
  onChange: (values: boolean) => void;
};

export default function Switch({ label, onChange }: SwitchProps) {
  return (
    <div className="flex items-center">
      <label className="pr-2" htmlFor="airplane-mode">
        {label}
      </label>
      <SwitchRadix.Root
        className="SwitchRoot"
        id="airplane-mode"
        onCheckedChange={onChange}
      >
        <SwitchRadix.Thumb className="SwitchThumb" />
      </SwitchRadix.Root>
    </div>
  );
}
