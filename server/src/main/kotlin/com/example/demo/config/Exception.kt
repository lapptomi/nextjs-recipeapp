package com.example.demo.config

open class Exception(message: String, cause: Throwable? = null) : RuntimeException(message, cause)

class RecipeNotFoundException(id: String) : Exception("Recipe with id $id not found")

class UserNotFoundException(id: String) : Exception("User with id $id not found")

class OpenAiException(message: String, cause: Throwable? = null) : Exception(message, cause)
