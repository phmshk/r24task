import { useEffect, useState, type RefObject } from "react";

interface ObserverItem {
  id: string;
  ref: RefObject<HTMLElement | null>;
}

export function useIntersectionObserver(
  items: ObserverItem[],
  options: IntersectionObserverInit,
) {
  const [activeId, setActiveId] = useState<string>(items[0].id || "");

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);

      if (visibleEntries.length > 0) {
        const mostVisible = visibleEntries.reduce((prev, current) =>
          prev.intersectionRatio > current.intersectionRatio ? prev : current,
        );

        const activeItem = items.find(
          (item) => item.id === mostVisible.target.id,
        );
        if (activeItem) {
          setActiveId(activeItem.id);
        }
      }
    }, options);

    items.forEach((item) => {
      if (item.ref.current) {
        observer.observe(item.ref.current);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [items, options]);

  return { activeId, setActiveId };
}
