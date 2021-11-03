import React, { useEffect, useCallback } from 'react';
import CodeBlock from '../CodeBlock/CodeBlock';
import PropTypes from 'prop-types';
import './HandList.css';
import { useSelector, useDispatch } from 'react-redux';
import { addBlock, setList, removeBlockFromField } from '../../redux/actions';
import update from 'immutability-helper';
import { ItemTypes } from '../../utils/itemtypes';
import { useDrop } from 'react-dnd';
import store from '../../redux/store/store';

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

  // find the block and index based on id
  const findBlock = useCallback(
    (id) => {
      const block = blocks.filter((block) => block.id === id)[0];
      if (block === undefined) return undefined;

      return {
        block,
        index: blocks.indexOf(block),
      };
    },
    [blocks]
  );

  // update the position of the block when moved
  // TODO: implement block moved from solution field and vice versa
  const moveBlock = useCallback(
    (id, atIndex) => {
      let updatedBlocks;
      const blockObj = findBlock(id);
      // get block if it exists in handlist. undefined means the block came from a solutionfield. in that case, state will be updated elsewhere

      if (blockObj !== undefined) {
        updatedBlocks = update(blocks, {
          $splice: [
            [blockObj.index, 1],
            [atIndex, 0, blockObj.block],
          ],
        });
        dispatch(setList(updatedBlocks, handListIndex));
      } else {
        // TODO: kalle på en annen action
        // hent solutionfield state. hent blocken
        // dispatch å fjerne den blocken fra fieldet
        //  dispatch å oppdatere handlist til å ha den blocken
        let solutionField = store.getState().solutionField;
        let movedBlock = solutionField.filter((line) => line.block.id === id)[0]
          .block;

        updatedBlocks = [
          ...blocks.slice(0, atIndex),
          movedBlock,
          ...blocks.slice(atIndex),
        ];
        dispatch(setList(updatedBlocks, handListIndex));
        dispatch(removeBlockFromField(id));
      }
    },

    [findBlock, blocks]
  );

  // blocks can be dropped into hand list
  const [, drop] = useDrop(() => ({ accept: ItemTypes.CODEBLOCK }));

  return (
    <div className={'divHL'} ref={drop}>
      <ul data-testid={`handList-player${player}`}>
        {blocks.map((codeBlock) => {
          return (
            <li className={'li'} key={codeBlock.id}>
              <CodeBlock
                {...codeBlock}
                moveBlock={moveBlock}
                findBlock={findBlock}
              />
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
