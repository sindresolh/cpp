import React from 'react';
import './SidebarButton.css';


/** Standard button. Used in the Sidebar component.
 *
 * @param {title} : Button text
 * @param {icon} : Path to image source
 * @param {icon} : Background color
 * @param {icon} : Callback function when clicked
 *
 * @returns
 */
export default function SidebarButton({ title, icon, color, handleClick }) {
  /**
   * Sets the backround color of the button. CSS hover cannot be used since color is set inline from a prop.
   *
   * @param {*} e : event
   * @param {*} backgroundColor : hexcode
   */
  function setBackground(e, backgroundColor) {
    e.target.style.background = backgroundColor;
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={(e) => setBackground(e, '#c2c2c2')}
      onMouseLeave={(e) => setBackground(e, color)}
      style={{ background: color }}
      className='SideBarButton'
      disabled={disabled}
    >
      <img height='30' width='auto' src={icon} alt='Icon' />
      <div>{title}</div>
    </button>
  );
}
