# Source: https://pynative.com/python-basic-exercise-for-beginners/

# Description: Write a function to remove characters from a string starting from zero up to n and return a new string.

# Hint: remove_chars("pynative", 2) should result in output native.
# Hint: Use string slicing to get the substring. For example, to remove the first four characters and the remeaning use s[4:].

def remove_chars(word, n):
    x = word[n:]
    return x

#$function remove_chars(word, n)
#$x.pop(n)