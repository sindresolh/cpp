# Source: https://pynative.com/python-basic-exercise-for-beginners/

# Description: Write a function to check if the given number is a palindrome number. 
# A palindrome number is a number that is same after reverse.

# Hint: Given 121 the function should return true
# Hint: Given 125 the function should return false
# Hint: All codeblocks should be utilized in this task. No distractors.

def palindrome(num):

    original_num = num
    
    # Reverse the given number
    reverse_num = 0
    while num > 0:
        reminder = num % 10
        reverse_num = (reverse_num * 10) + reminder
        num = num // 10

    # Check numbers
    if original_num == reverse_num:
        return True
    else:
        return False