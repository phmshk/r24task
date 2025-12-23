import { socketsPositioningSchema } from "./socketsPositioningSchema";
import { SOCKET_MARGIN_FROM_EDGE, SOCKET_SIZE } from "@/shared/constants";
import { ValidatedNumberInput } from "@/modules/Sidebar/components/shared/ValidatedNumberInput";

interface PositioningProps {
  limit: number;
  defaultValue: number;
  onValueChange: (value: number) => void;
  inverted?: boolean;
}

export const PositioningInput = (props: PositioningProps) => {
  const { limit, defaultValue, onValueChange, inverted } = props;
  const min = SOCKET_MARGIN_FROM_EDGE + SOCKET_SIZE / 2;
  const max = limit - (SOCKET_MARGIN_FROM_EDGE + SOCKET_SIZE / 2);

  const displayedValue = inverted
    ? parseFloat((limit - defaultValue).toFixed(1))
    : defaultValue;

  const handleValueChange = (newValue: number) => {
    const finalValue = inverted
      ? parseFloat((limit - newValue).toFixed(1))
      : newValue;

    onValueChange(finalValue);
  };

  const schema = socketsPositioningSchema(min, max);

  return (
    <div>
      <ValidatedNumberInput
        onValueChange={handleValueChange}
        value={displayedValue}
        max={max}
        min={min}
        schema={schema}
        className="md:max-w-60"
      />
    </div>
  );
};
