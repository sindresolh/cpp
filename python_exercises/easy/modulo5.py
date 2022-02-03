# Source: https://pynative.com/python-basic-exercise-for-beginners/

# Description: Iterate the given list of numbers and print only those numbers which are divisible by 5

# Hint: % (modulo) is a math operation that finds the remainder when one integer is divided by another

num_list = [10, 33, 55]
for num in num_list:
    if num % 5 == 0:
        print(num)

#$if num / 5 == 0:
#$for num in range(num_list):