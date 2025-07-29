import { ModalProps } from 'antd';
import React, { FC, ReactNode, useRef, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import CModal from '.';

interface Props extends ModalProps {
  children?: ReactNode;
  title?: string;
}
const ModalDraggable: FC<Props> = React.memo(
  ({ loading, children, title, ...props }) => {
    const [disabled, setDisabled] = useState(true);
    const [bounds, setBounds] = useState({
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
    });
    const draggleRef = useRef<HTMLDivElement>(null);
    const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
      const { clientWidth, clientHeight } = window.document.documentElement;
      const targetRect = draggleRef.current?.getBoundingClientRect();
      if (!targetRect) {
        return;
      }
      setBounds({
        left: -targetRect.left + uiData.x,
        right: clientWidth - (targetRect.right - uiData.x),
        top: -targetRect.top + uiData.y,
        bottom: clientHeight - (targetRect.bottom - uiData.y),
      });
    };
    return (
      <CModal
        title={
          <div
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
            className="cursor-move"
          >
            {title ? title : ''}
          </div>
        }
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            nodeRef={draggleRef}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
        closable={true}
        {...props}
      >
        {children}
      </CModal>
    );
  }
);
export default ModalDraggable;
