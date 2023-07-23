// Checkbox component used on Browse page - Recipe filter, Shopping list page

// TODO -

import * as CheckboxRadix from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { v4 as uuidv4 } from "uuid";
import Icon from "../Icon/Icon";
import "./styles.scss";

type CheckboxProps = {
  label: string;
  onChange: (values: boolean) => void;
};

export default function Checkbox({ label, onChange }: CheckboxProps) {
  return (
    <div className="flex items-center">
      <CheckboxRadix.Root
        className="CheckboxRoot"
        defaultChecked
        id={uuidv4()}
        onCheckedChange={onChange}
      >
        <CheckboxRadix.Indicator className="CheckboxIndicator">
          <Icon size="sm">
            <CheckIcon />
          </Icon>
        </CheckboxRadix.Indicator>
      </CheckboxRadix.Root>
      <label className="pl-2 cursor-pointer" htmlFor={uuidv4()}>
        {label}
      </label>
    </div>
  );
}
