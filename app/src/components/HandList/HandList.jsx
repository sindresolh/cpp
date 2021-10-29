import React, { useEffect } from 'react';
import CodeBlock from '../CodeBlock/CodeBlock';
import PropTypes from 'prop-types';
import './HandList.css';
import { useSelector, useDispatch } from 'react-redux';
import { addBlock, setList } from '../../redux/actions';

/**
 * This component represents a list of code blocks. Each player will have a list.
 * This list can accept dragged codeblocks if it is the correct player.
 *
 * @param {Array} codeBlocks        code blocks in the list
 * @param {Number} player           which player owns the list
 * @returns         a div containing a list of codeblocks
 */
function HandList({ codeBlocks, player }) {
  // TODO: implement droppable
  // TODO: implement reference?
  const dispatch = useDispatch();
  const handListIndex = player - 1;
  const blocks = useSelector((state) => state.handList[handListIndex]);

  // Only set the list on initial render. This might not be an ideal solution -H
  useEffect(() => {
    dispatch(setList(codeBlocks, handListIndex));
  }, []);

  return (
    <div>
      <ul data-testid={`handList-player${player}`}>
        {blocks.map((codeBlock) => {
          return (
            <li className={'li'} key={codeBlock.id}>
              <CodeBlock {...codeBlock} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

HandList.propTypes = {
  codeBlocks: PropTypes.array,
  player: PropTypes.number,
};

export default HandList;
