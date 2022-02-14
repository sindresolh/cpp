# Taken from: https://www.w3resource.com/python-exercises/data-structures-and-algorithms/python-recursion.php

#Description: Create a function that sums elements in an array and returns the sum.

# Hint: A nested list is a list that contains other lists. For example [[1, 2, 3],[4, 5, 6],[7, 8, 9]] 
# Hint: Recursively call the function as long as the element is an array

def recursive_list_sum(items):
	total = 0
	for element in items:
		if type(element) == type([]):
			total += recursive_list_sum(element)
		else:
			total = total + element
	return total

#$function recursive_list_sum(items):
#$for element in range(items):

print(recursive_list_sum([[1, 2, 3],[4, 5, 6],[7, 8, 9]]))