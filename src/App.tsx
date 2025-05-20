import {
  CancelDrop,
  CollisionDetection,
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  DropAnimation,
  KeyboardSensor,
  MeasuringStrategy,
  Modifiers,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Dispatch } from "@reduxjs/toolkit";
import { useEffect, useMemo, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import "./App.css";
import useCollisionDetection from "./components/EventObject/CollisionComponent/CollisionComponent";
import { EventObject } from "./components/EventObject/EventObject";
import {
  onDragCancel,
  onDragEnd,
  onDragOver,
  onDragStart,
} from "./components/EventObject/OnDragEvents";
import { renderDragOverlayContainer } from "./components/EventObject/OverlayComponents/DragOverlayContainer";
import { renderDragOverlaySortableItem } from "./components/EventObject/OverlayComponents/DragOverlaySortableItem";
import { setContainers } from "./store/slices/days";
import { RootState } from "./store/store";
import { coordinateGetter } from "./utils/utils";
import { createPortal } from "react-dom";

export const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: "0.5" } } }),
};

function App() {
  const cancelDrop: CancelDrop = () => true;
  const modifiers: Modifiers = [];

  const { items, activeId, scheduledEvents } = useSelector(
    (state: RootState) => state.data,
    shallowEqual
  );
  const dispatch = useDispatch<Dispatch>();

  const initialized = useRef<boolean>(false);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef<boolean>(false);
  // Initialize scheduledEvents on mount
  useEffect(() => {
    if (!initialized.current) {
      dispatch(setContainers(Object.keys(items)));
      initialized.current = true;
    }
  }, [items, dispatch]);
  // Reset recentlyMovedToNewContainer on activeId change
  useEffect(() => {
    recentlyMovedToNewContainer.current = false;
  }, [activeId]);

  // Custom collision detection strategy
  const collisionDetectionStrategy: CollisionDetection = useCollisionDetection(
    recentlyMovedToNewContainer,
    lastOverId
  );

  // Define sensors with activation constraints
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter })
  );

  // Memoize drag overlay content to avoid unnecessary re-renders
  const dragOverlayContent = useMemo(() => {
    if (!activeId) return null;

    return scheduledEvents.includes(activeId)
      ? renderDragOverlayContainer({ containerId: activeId, items, columns, handle })
      : renderDragOverlaySortableItem({ id: activeId, items, handle });
  }, [activeId, scheduledEvents, items, columns, handle]);

  return (
    <main className="container">
      <div className="days">
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetectionStrategy}
          onDragStart={onDragStart}
          onDragOver={(event) => onDragOver(event, recentlyMovedToNewContainer)}
          onDragEnd={onDragEnd}
          onDragCancel={onDragCancel}
          cancelDrop={cancelDrop}
          modifiers={modifiers}
          measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        >
          <EventObject />

          {createPortal(
            <DragOverlay adjustScale={false} dropAnimation={dropAnimation}>
              {dragOverlayContent}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
    </main>
  );
}

export default App;
