__author__ = 'chul'

def world(some_func):
 def pre(arg):
    greet = some_func(arg)
    return greet + ' world!'
 def sec(arg):
     come = some_func(arg)
     return come + ' together!'
 return pre

@world
def whatever(word):
 return word

abc = whatever('hello')

print(abc)