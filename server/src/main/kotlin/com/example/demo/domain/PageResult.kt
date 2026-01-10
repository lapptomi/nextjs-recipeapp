package com.example.demo.domain

data class PageResult<T>(
    val content: List<T>,
    val page: Int,
    val size: Int,
    val numberOfElements: Int,
    val totalElements: Long,
)
