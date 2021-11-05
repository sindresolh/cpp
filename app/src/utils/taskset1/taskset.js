// Samler alle tasks til et taskset

import { task1 } from './tasks/task1';
import { task2 } from './tasks/task2';

export const taskset = {
  author: 'Sindre Solheim',
  date: new Date(2021, 10, 5), // Note: In javascripts months starts at 0, so december is 11 :)
  description: 'Example task set',
  tasks: [task1, task2],
};
