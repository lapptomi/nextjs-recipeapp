package com.example.demo.config

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.web.bind.MethodArgumentNotValidException
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

    @ExceptionHandler
    fun handleBadCredentialsException(e: BadCredentialsException): ResponseEntity<ErrorMessage> {
        val errorMessage = ErrorMessage(HttpStatus.UNAUTHORIZED.value(), e.message)
        return ResponseEntity(errorMessage, HttpStatus.UNAUTHORIZED)
    }

    @ExceptionHandler
    fun handleIllegalArgumentException(e: IllegalArgumentException): ResponseEntity<ErrorMessage> {
        val errorMessage = ErrorMessage(HttpStatus.BAD_REQUEST.value(), e.message)
        return ResponseEntity(errorMessage, HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler
    fun handleMethodArgumentNotValidException(e: MethodArgumentNotValidException): ResponseEntity<ErrorMessage> {
        val firstErrorMessage = e.bindingResult.fieldErrors.firstOrNull()?.defaultMessage ?: "Invalid request body"
        val errorMessage = ErrorMessage(HttpStatus.BAD_REQUEST.value(), firstErrorMessage)
        return ResponseEntity(errorMessage, HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler
    fun handleOpenAiException(e: OpenAiException): ResponseEntity<ErrorMessage> {
        val errorMessage = ErrorMessage(HttpStatus.BAD_GATEWAY.value(), e.message)
        return ResponseEntity(errorMessage, HttpStatus.BAD_GATEWAY)
    }
}
