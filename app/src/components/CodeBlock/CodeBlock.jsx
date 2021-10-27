import React from 'react';
import './CodeBlock.css';
import { ItemTypes } from '../../utils/itemtypes';
import { useRef } from 'react';
import { useDrag } from 'react-dnd'


function CodeBlock({ id, content, player, category, placement=null}) {
    const placementRef = useRef(placement)
    const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
        type: ItemTypes.CODEBLOCK,
        item: {id, content, player, placement: placementRef.current}
    ,
    collect: (monitor) => ({
        isDragging: monitor.isDragging(), 
      })}
    ))
      

    let className = isDragging ? `cb c${category} p${player} dragging` : `cb c${category} p${player}`

  return (
    <div
    ref={drag}
      data-testid={`codeBlock-p${player}`}
      id={id}
      className={className}
    >
      {content}
    </div>
  );
}

export default CodeBlock;
