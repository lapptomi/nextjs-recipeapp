package com.example.demo.config

open class Exception(message: String, cause: Throwable? = null) : RuntimeException(message, cause)

class RecipeNotFoundException(id: String) : Exception("Recipe with id $id not found")

class UserNotFoundException(id: String) : Exception("User with id $id not found")

class OpenAiConfigurationException(message: String) : Exception(message)

class OpenAiProviderException(message: String, cause: Throwable? = null) : Exception(message, cause)

class OpenAiValidationException(message: String) : Exception(message)
