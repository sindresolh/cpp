// Different types of codeblocks. Decides codeblock background-colors.
export const CATEGORY = {
  UNDEFINED: 'undefined',
  VARIABLE: 'variable',
  FUNCTION: 'function',
  LOOP: 'loop',
  CONDITION: 'condition',
};

// Decides the player that owns the codeblock and the codeblock border-colors.
export const PLAYER = {
  UNASSIGNED: 0,
  P1: 1,
  P2: 2,
  P3: 3,
  P4: 4,
};

// Colors used troughout the application, see the design guide in README
export const COLORS = {
  header: 'linear-gradient(to bottom, #3148bc, #2c41ac)',
  background: 'linear-gradient(to bottom, #e2e2e2, #c2c2c2)',
  sidebar: 'linear-gradient(to bottom, #677edb, #4e67d1)',
  solutionfield: '#eeeeee',
  codeline: '#e8e8e8',
  taskfield: '#e8e8e8',
  darkred: '#dd4932',
  darkyellow: '#e88e28',
  darkblue: '#3c53cb',
  darkgreen: '#2b6e38',
  lightred: '#fcc6be',
  lightyellow: '#fbd392',
  lightblue: '#c4ccf5',
  lightgreen: '#8bbe95',
};

export const X_INDENT = 50;
