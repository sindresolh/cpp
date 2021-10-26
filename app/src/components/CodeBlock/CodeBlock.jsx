import React from 'react';
import './CodeBlock.css';

function getClassName(player, category) {
  const className = `cb c${category} p${player}`;
  return className;
}

function CodeBlock({ id, content, player, category }) {
  return (
    <div
      data-testid={`codeBlock-p${player}`}
      id={id}
      className={getClassName(player, category)}
    >
      {content}
    </div>
  );
}

export default CodeBlock;
