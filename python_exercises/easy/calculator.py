# Python program for simple calculator

# Description: Create a simple calculator. The program should first ask for an
# integer, then an operator (+,-,*,/), and lastly a second integer.
# The answer shall be printed back to the user

# Hint: think about the type of the inputs

number_1 = int(input("Enter first number: "))
operator = input("Enter operator (+,-,*,/): ")
number_2 = int(input("Enter second number: "))

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

#$operator = int(input("Enter operator (+,-,*,/): "))
#$number_1 = input("Enter first number: ")
#$number_2 = input("Enter second number: ")