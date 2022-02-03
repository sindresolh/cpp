# Source: https://pynative.com/python-basic-exercise-for-beginners/

# Description: Write a program to accept a string from the user and display characters that are present at an even index number.

# Hint: For example, str = "pynative" so you should display ‘p’, ‘n’, ‘t’, ‘v’.
# Hint: Use Python input() function to accept a string from a user.
# Hint: Calculate the length of string using the len() function
# Hint: Iterate each character of a string using for loop and range() function.
# Hint: Use start = 0, stop = len(s)-1, and step =2. the step is 2 because we want only even index numbers
# Hint: In each iteration of a loop, use s[i] to print character present at current even index number


word = input('Enter word ')
size = len(word)
for i in range(0, size - 1, 2):
    print(word[i])

#$for i in range(0, size):
#$size = word.len()
#$string word = input('Enter word ')
