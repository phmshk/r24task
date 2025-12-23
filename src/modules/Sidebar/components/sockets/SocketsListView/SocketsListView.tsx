import { Button } from "@/shared/components/ui/button";
import type { SocketGroup } from "@/shared/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/components/ui/dropdown-menu";
import { Trash2, Pencil, MoreVertical, Info } from "lucide-react";
import type { MouseEvent } from "react";

interface SocketsListProps {
  socketGroups: SocketGroup[];
  onEdit: (groupId: string) => void;
  onDelete: (groupId: string) => void;
  onAdd: () => void;
  onSelect: (groupId: string) => void;
  canAddMore: boolean;
}

const formatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

export const SocketsListView = (props: SocketsListProps) => {
  const { socketGroups, onEdit, onDelete, onAdd, canAddMore, onSelect } = props;

  const handleSelect = (
    groupId: string,
    e: MouseEvent<HTMLDivElement | HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect(groupId);
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {socketGroups.map((group) => (
          <div
            aria-label="Socket group selection and info about particular socket group"
            key={group.id}
            className="border-muted flex cursor-pointer items-center justify-between rounded-md border-2 p-2"
            onClick={(e) => handleSelect(group.id, e)}
          >
            <div className="flex items-center gap-2 text-sm font-bold">
              <span>1. Rückwand - 80 x 40</span>
              <span className="text-muted-foreground font-normal">|</span>
              <span>
                {group.count}x Steckdose{" "}
                <span className="text-muted-foreground">
                  + {formatter.format(group.count * 20)}
                </span>
              </span>
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer"
                  >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Menü öffnen</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => onEdit(group.id)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Bearbeiten
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(group.id)}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Löschen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
      {!canAddMore && (
        <div className="flex items-start gap-2 rounded-md border border-yellow-600 px-2 py-4 text-yellow-600">
          <Info />
          <div>
            <h3>Hinweis</h3>
            <p>
              Für diese Maße ist es nicht mehr möglich neue Ausschnitte
              hinzuzufügen. Bitte ändere die Maße der Platte
            </p>
          </div>
        </div>
      )}
      <Button
        variant="outlineSuccess"
        className="h-12 w-fit cursor-pointer text-base font-normal md:self-end"
        onClick={onAdd}
        disabled={!canAddMore}
      >
        Steckdose hinzufügen
      </Button>
    </div>
  );
};
