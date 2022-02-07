# Python program for simple calculator

# Description: Create a simple calculator. The program should first ask for an
# integer, then an operator (+,-,*,/), and lastly a second integer.
# The answer shall be printed back to the user

# Hint: think about the type of the inputs


str1 = "Enter a number"
str2 = "Enter +,-,* or /"

number_1 = int(input(str1))
operator = input(str2)
number_2 = int(input(str1))

if operator == '+':
    print(number_1 + number_2)
  
elif operator == '-':
    print(number_1 - number_2)
  
elif operator == '*':
    print(number_1 * number_2)
  
elif operator == '/':
    print(number_1 / number_2)

#$else if operator == '-':
#$else if operator == '*':
#$else if operator == '/':

#$operator = int(input(str2))
#$number_1 = input(str1)
#$number_2 = input(str1)