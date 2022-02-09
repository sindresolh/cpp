import React from 'react';
import { useDispatch } from 'react-redux';
import { goToLobby, setTaskNumber } from '../../redux/actions';
import './Finished.css';
import SidebarButton from '../../components/Sidebar/SidebarButton/SidebarButton';
import CheckButton from '../../images/buttonIcons/check.png';
import { COLORS } from '../../utils/constants';

function Finished() {
  const dispatch = useDispatch();

  return (
    <div className='finished' style={{ background: COLORS.background }}>
      <h1>Congratulations!</h1>
      <h6>TODO: oppsumering av utførelse</h6>
      <SidebarButton
        title='Return to lobby'
        icon={CheckButton}
        color={COLORS.lightblue}
        handleClick={() => {
          dispatch(setTaskNumber(0));
          dispatch(goToLobby());
        }}
        width='20vh'
      />
    </div>
  );
}

export default Finished;
