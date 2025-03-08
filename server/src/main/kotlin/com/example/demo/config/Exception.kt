package com.example.demo.config

open class Exception(message: String) : RuntimeException(message)

class RecipeNotFoundException(id: String) : Exception("Recipe with id $id not found")

class UserNotFoundException(id: String) : Exception("User with id $id not found")
