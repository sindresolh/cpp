# Python program for printing out the fibbonaci sequence

# Description: Create a program that asks for a positive integer n.
# The program then prints out the first n numbers in the fibonacci sequence.
# The first two numbers in the fibonacci sequence is 0 and 1.
# The next number is obtained by adding the preceding two terms. 

# Hint: The first 7 numbers in the fibonacci sequence becomes: 0, 1, 1, 2, 3, 5, 8
# Hint : A fibbonaci sequence with 1 entry is an edge case. Check for this edge case first.
# Hint: All codeblocks should be utilized in this task. No distractors.

n = int(input("Enter sequence lenght "))
n1, n2 = 0, 1
count = 0
if n == 1:
   print(n1)
else:
   while count < n:
       print(n1)
       nth = n1 + n2
       # update values
       n1 = n2
       n2 = nth
       count += 1