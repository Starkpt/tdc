import { DraggableSyntheticListeners, UniqueIdentifier } from "@dnd-kit/core";
import { Items } from "../../../types/types";
import { useEffect } from "react";
import { getIndex } from "../../../utils/utils";
import classNames from "classnames";
import styles from "./Item.module.css";
import { Remove } from "../Actions/Remove";
import { Handle } from "../Actions/Handle";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { EventObject } from "../EventObject";

export interface ContainerDragOverlay {
  containerId: UniqueIdentifier;
  items: Items;
  columns?: number;
  handle: boolean;
  dragOverlay?: boolean;
  getItemStyles?(args: {
    value: UniqueIdentifier;
    index: number;
    overIndex: number;
    isDragging: boolean;
    containerId: UniqueIdentifier;
    isSorting: boolean;
    isDragOverlay: boolean;
  }): React.CSSProperties;
}

export function renderDragOverlayContainer({
  containerId,
  items,
  columns,
  handle = false,
  dragOverlay = false,
  getItemStyles = () => ({}),
}: ContainerDragOverlay) {
  // Update cursor during drag overlay
  useEffect(() => {
    if (dragOverlay) {
      document.body.style.cursor = "grabbing";
      return () => {
        document.body.style.cursor = "";
      };
    }
  }, [dragOverlay]);

  // Define inline styles
  const computedStyles: React.CSSProperties = {
    containerId,
    overIndex: -1,
    isDragging: false,
    isSorting: false,
    isDragOverlay: false,
    backgroundColor: "#FFECDF",
    maxHeight: "127px",
    maxWidth: "393px",
    // transition: [transition, styles?.transition].filter(Boolean).join(", "),
    // "--translate-x": transform ? `${Math.round(transform.x)}px` : undefined,
    // "--translate-y": transform ? `${Math.round(transform.y)}px` : undefined,
    // "--scale-x": transform?.scaleX ? `${transform.scaleX}` : undefined,
    // "--scale-y": transform?.scaleY ? `${transform.scaleY}` : undefined,
    // "--index": index,
    // "--color": color,
  } as React.CSSProperties;

  const classnamies = classNames(styles.Wrapper, {
    // [styles.fadeIn]: fadeIn,
    // [styles.sorting]: sorting,
    [styles.dragOverlay]: dragOverlay,
  });

  const classnamiesTwo = classNames(styles.Item, {
    [styles.withHandle]: handle,
    [styles.dragOverlay]: dragOverlay,
    // [styles.dragging]: dragging,
    // [styles.disabled]: disabled,
    // [styles.color]: color,
  });

  const listeners: DraggableSyntheticListeners = {};

  const onRemove: () => void = () => {};

  return (
    <Container
      label={`Column ${containerId}`}
      columns={columns}
      style={{ height: "100%" }}
      shadow
      unstyled={false}
    >
      {items[containerId].map((item, index) => (
        // <Item
        //   key={index}
        //   value={item}
        //   handle={handle}
        //   style={getItemStyles({
        //     containerId,
        //     overIndex: -1,
        //     index: getIndex(item, items),
        //     value: item,
        //     isDragging: false,
        //     isSorting: false,
        //     isDragOverlay: false,
        //   })}
        //   color={getColor(item)}
        // />

        <li
          // ref={ref}
          className={classnamies}
          style={computedStyles}
        >
          <div
            className={classnamiesTwo}
            data-cypress="draggable-item"
            tabIndex={!handle ? 0 : undefined}
            {...(!handle ? listeners : undefined)}
            // {...props}
          >
            <ul>
              <SortableContext items={items[containerId]} strategy={verticalListSortingStrategy}>
                {items[containerId]?.length ? (
                  items[containerId]?.map((value, index) => (
                    <EventObject
                      id={containerId}
                      key={index}
                      value={value}
                      containerId={value}
                      items={items}
                      
                    />
                  ))
                ) : (
                  <div>
                    <p>No events</p>
                  </div>
                )}
              </SortableContext>
              {/* <DropdownSelect
                containerId="no-container"
                id="no-id"
                items={items}
                value="no-value"
              /> */}
            </ul>
            <span className={styles.Actions}>
              {onRemove && <Remove className={styles.Remove} onClick={onRemove} />}
              {handle && <Handle ref={handleRef} {...handleProps} />}
            </span>
          </div>
        </li>
      ))}
    </Container>
  );
}
