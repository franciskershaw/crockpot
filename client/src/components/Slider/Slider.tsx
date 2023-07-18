// Slider component used on Browse page - recipe filter

import { useState, useEffect, useRef } from "react";
import * as SliderRadix from "@radix-ui/react-slider";
import "./styles.scss";

function SliderThumbWithValue() {
  const [value, setValue] = useState("");
  const thumbRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const updateValue = () => {
      if (thumbRef.current) {
        const newValue = thumbRef.current.getAttribute("aria-valuenow");
        if (newValue !== null) {
          setValue(newValue);
        }
      }
    };

    const observer = new MutationObserver(updateValue);
    if (thumbRef.current) {
      observer.observe(thumbRef.current, {
        attributes: true,
      });

      updateValue();
    }

    return () => observer.disconnect();
  }, []);

  return (
    <SliderRadix.Thumb ref={thumbRef} className="SliderThumb">
      <div className="SliderThumbValue">{value}</div>
    </SliderRadix.Thumb>
  );
}

export default function Slider() {
  return (
    <SliderRadix.Root
      className="SliderRoot"
      defaultValue={[25, 75]}
      step={5}
      minStepsBetweenThumbs={1}
    >
      <SliderRadix.Track className="SliderTrack">
        <SliderRadix.Range className="SliderRange" />
      </SliderRadix.Track>
      <SliderThumbWithValue />
      <SliderThumbWithValue />
    </SliderRadix.Root>
  );
}
