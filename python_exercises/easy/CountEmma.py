# Source: https://pynative.com/python-basic-exercise-for-beginners/

# Description: Write a program to find how many times substring “Emma” appears in the given string.

# Hint: Given "Emma is good developer. Emma is a writer" the function should return 2.
# Hint: Use string method count()

str1 =  "Emma is a good writer."
str2 = "Emma is great developer."
str3 = str1 + str2

answ = str.count("Emma")
print(answ)

#$answ = "Emma".count(str)
#$answ = "Emma".get(str)
#$answ = str.get(Emma)