import { UniqueIdentifier } from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Select, { StylesConfig } from "react-select";
import { RootState } from "../../store/store";
import { getColor } from "../../utils/utils";
import { useMountStatus } from "../../hooks/customHooks";

type Game = { label: string; value: string; image: string };

const games: Game[] = [
  { label: "Dragon Ball Super W", value: "dbsw", image: "/games-logos/dbsw.png" },
  { label: "Dragon Ball Super B", value: "dbsb", image: "/games-logos/dbsb.png" },
  { label: "Magic: the Gathering", value: "mtg", image: "/games-logos/mtg.png" },
  { label: "Flesh & Blood", value: "fab", image: "/games-logos/fab.png" },
  { label: "Yu-Gi-Oh!", value: "ygo", image: "/games-logos/ygu.png" },
  { label: "Vanguard", value: "vng", image: "/games-logos/vng.png" },
  { label: "One Piece", value: "op", image: "/games-logos/op.png" },
  { label: "Pokémon", value: "pkm", image: "/games-logos/pkm.png" },
  { label: "Lorcana", value: "lcn", image: "/games-logos/lcn.png" },
];

const dotStyles: StylesConfig<Game> = {
  control: (styles) => ({ ...styles, backgroundColor: "white" }),
  option: (styles) => ({ ...styles, backgroundColor: "white" }),
  input: (styles) => ({ ...styles, height: "80px" }),
  singleValue: (styles) => ({ ...styles, width: "100%" }),
  container: (styles) => ({ ...styles, width: "100%" }),
  // menu: (styles) => ({ ...styles, backgroundColor: "black", position: "relative" }),
  menuPortal: (styles) => ({ ...styles, zIndex: 99999 }),
};

export type ItemsType = {
  // Dynamic keys with number[] or string[] as values
  [key: string]: UniqueIdentifier[];
};

const itemCount = 3;
const PLACEHOLDER_ID = "placeholder";

export const EventObject = (
  containerId?: UniqueIdentifier,
  id: UniqueIdentifier,
  vertical?: false
) => {
  // Access state context
  const { items, activeId, scheduledEvents } = useSelector(
    (state: RootState) => state.data,
    shallowEqual
  );

  if (!items) {
    return <div>no items</div>;
  }

  // Filtered scheduledEvents for SortableContext
  const filteredContainers = useMemo(
    () => scheduledEvents.filter((containerId) => containerId !== PLACEHOLDER_ID),
    [scheduledEvents]
  );

  // Determine strategy based on vertical prop
  const sortingStrategy = vertical ? verticalListSortingStrategy : horizontalListSortingStrategy;

  const { setNodeRef, listeners, isDragging, isSorting, transform, transition } = useSortable({
    id,
  });

  const mounted = useMountStatus();
  const color = useMemo(() => getColor(id), [id]);
  const fadeIn = isDragging && !mounted;

  // Update cursor style when dragging
  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = "grabbing";

      return () => {
        document.body.style.cursor = "";
      };
    }
  }, [isDragging]);

  const computedStyle: React.CSSProperties & { [key: string]: string | number | undefined } = {
    ...wrapperStyles,
    transition: [transition, wrapperStyles?.transition].filter(Boolean).join(", "),
    "--translate-x": transform ? `${Math.round(transform.x)}px` : undefined,
    "--translate-y": transform ? `${Math.round(transform.y)}px` : undefined,
    "--scale-x": transform?.scaleX ? `${transform.scaleX}` : undefined,
    "--scale-y": transform?.scaleY ? `${transform.scaleY}` : undefined,
    "--index": index,
    "--color": color,
  };

  // Class names using helper function for readability
  const wrapperClassNames = classNames(styles.Wrapper, {
    [styles.fadeIn]: fadeIn,
    [styles.sorting]: isSorting,
    [styles.dragOverlay]: isDragging,
  });

  const itemClassNames = classNames(styles.Item, {
    [styles.dragging]: isDragging,
    [styles.color]: color,
  });

  return (
    <li ref={setNodeRef} className={wrapperClassNames} style={computedStyle}>
      <div
        className={itemClassNames}
        style={{
          backgroundColor: "#FFECDF",
          maxHeight: "127px",
          maxWidth: "393px",
        }}
        data-cypress="draggable-item"
        tabIndex={0}
        {...listeners}
      >
        <Select
          menuPlacement="auto"
          maxMenuHeight={200}
          menuPortalTarget={document.body} // Defaults to `document.body` if ref is undefined
          styles={dotStyles}
          options={games}
          defaultValue={games[1]}
          formatOptionLabel={(game) => (
            <div
              className="game-option"
              style={{
                height: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={game.image} style={{ height: "60px" }} alt={`${game.label}-image`} />
            </div>
          )}
        />

        {/* 
          <span className={styles.Actions}>
            {onRemove ? <Remove className={styles.Remove} onClick={onRemove} /> : null}
            {handle ? <Handle ref={handleRef} {...handleProps} /> : null}
          </span> 
        */}
      </div>
    </li>
  );
};
