import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/shared/components/ui/toggle-group";

interface SocketGroupSettingsProps {
  title: string;
  items: string[];
  variant: "outlineOrientation" | "outlineNumber";
  value: string;
  onChange: (value: string) => void;
  disabledItems?: string[];
}

export const SocketGroupSettings = (props: SocketGroupSettingsProps) => {
  const { title, items, variant, value, onChange, disabledItems = [] } = props;
  return (
    <div className="w-full max-w-md space-y-2 lg:w-fit">
      <h4 className="text-base font-medium">{title}</h4>
      <ToggleGroup
        type="single"
        variant={variant}
        value={value}
        onValueChange={(newValue) => {
          if (newValue) {
            onChange(newValue);
          }
        }}
        className="flex w-full items-center justify-start lg:w-fit"
      >
        {items.map((option) => (
          <ToggleGroupItem
            key={option}
            value={option}
            aria-label={`${option} sockets`}
            className="flex-1"
            disabled={disabledItems.includes(option)}
          >
            {option}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};
