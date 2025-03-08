package com.example.demo.config

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

class ErrorMessage(val status: Int? = null, var message: String? = null)

@ControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler
    fun handleUserNotFoundException(e: UserNotFoundException): ResponseEntity<ErrorMessage> {
        val errorMessage = ErrorMessage(HttpStatus.NOT_FOUND.value(), e.message)
        return ResponseEntity(errorMessage, HttpStatus.NOT_FOUND)
    }

    @ExceptionHandler
    fun handleRecipeNotFoundException(e: RecipeNotFoundException): ResponseEntity<ErrorMessage> {
        val errorMessage = ErrorMessage(HttpStatus.NOT_FOUND.value(), e.message)
        return ResponseEntity(errorMessage, HttpStatus.NOT_FOUND)
    }
}
