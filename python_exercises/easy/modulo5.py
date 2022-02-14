# Source: https://pynative.com/python-basic-exercise-for-beginners/

# Description: Iterate the given list of numbers and print only those numbers which are divisible by 5

# Hint: % (modulo) is a math operation that finds the remainder when one integer is divided by another
# Hint For example, 16 % 4 = 0, since if we divide 16 by 4, we get 4 with remainder 0.
# Hint: For example, 17 % 5 = 2, since if we divide 17 by 5, we get 3 with remainder 2.

num_list = [10, 33, 55]
for num in num_list:
    if num % 5 == 0:
        print(num)

#$if num / 5 == 0:
#$for num in range(num_list):