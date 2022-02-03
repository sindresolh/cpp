# Description: Given a two list of numbers, write a program to create a new list such that the new list should contain odd numbers 
# from the first list and even numbers from the second list.

# Hint: Create an empty list named result_list
# Hint: Iterate first list using a for loop, then iterate the next list using a for loop
# Hint: Use % (modulo) to check for odd or even numbers


def merge_list(list1, list2):
    result_list = []
    
    # iterate first list
    for num in list1:
        # check if current number is odd
        if num % 2 != 0:
            # add odd number to result list
            result_list.append(num)
    
    # iterate second list
    for num in list2:
        # check if current number is even
        if num % 2 == 0:
            # add even number to result list
            result_list.append(num)
    return result_list