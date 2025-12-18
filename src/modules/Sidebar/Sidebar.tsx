import { useProjectContext } from "@/app/providers";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

export const Sidebar = () => {
  const {
    addPlate,
    deletePlate,
    plates,
    resizePlate,
    toggleSocketMode,
    updateSocketGroup,
  } = useProjectContext();

  return (
    <>
      <h1 className="text-center text-2xl font-bold">Sidebar</h1>
      <div className="bg-card flex w-full items-center justify-between gap-2 rounded-md px-4 py-6">
        <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-md text-xl">
          1
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex w-full items-baseline justify-around">
            <span className="text-md font-bold">Breite</span>{" "}
            <span className="text-xs font-medium">20 - 300 cm</span>
          </div>
          <div className="relative w-full">
            <Input type="text" className="bg-white" />
            <span className="text-md text-foreground absolute top-1/2 right-3 -translate-y-1/2">
              cm
            </span>
          </div>
          <span>1515 mm</span>
        </div>
        <div>X</div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex w-full items-baseline justify-around">
            <span className="text-md font-bold">Höhe</span>{" "}
            <span className="text-xs font-medium">30 - 128 cm</span>
          </div>
          <div className="relative w-full">
            <Input type="text" className="bg-white" />
            <span className="text-md text-foreground absolute top-1/2 right-3 -translate-y-1/2">
              cm
            </span>
          </div>
          <span>1515 mm</span>
        </div>
        <div className="bg-destructive/40 text-destructive flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
          {"\u2014"}
        </div>
      </div>
    </>
  );
};
