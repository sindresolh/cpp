# Source: https://pynative.com/python-basic-exercise-for-beginners/

#Description: Write a function to return True if the first and last number of a given list is same. If numbers are different then return False.

# Hint: Given list: [10, 20, 30, 40, 10] result is True
# Hint: Given list: [75, 65, 35, 75, 30] result is False

def first_last_same(numList):
    first = numList[0]
    last = numList[-1]
    
    if first == last:
        return True
    else:
        return False

#$first = numList[1]
#$last = numList(len(numList))
#$if first = last: