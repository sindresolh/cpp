# Python program for simple calculator

# Description: Create a simple calculator. The program should first ask for an
# integer, then an operator (+,-,*,/), and lastly a second integer.
# The answer shall be printed back to the user

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