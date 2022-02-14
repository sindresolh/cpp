# Write a Python function to sum items in a list and return it.

# Description: Create a function that sums elements in an array and returns the sum.
# Taken from: https://www.w3resource.com/python-exercises/list/python-data-type-list-exercise-1.php

def sum_list(items):
    sum_numbers = 0
    for x in items:
        sum_numbers += x
    return sum_numbers
