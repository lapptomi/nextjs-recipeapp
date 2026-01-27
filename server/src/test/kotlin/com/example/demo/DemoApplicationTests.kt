package com.example.demo

import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.DirtiesContext

@DirtiesContext
@SpringBootTest
class DemoApplicationTests {
    @Test fun contextLoads() {}

    @Test
    fun test() {
        assert(true)
    }
}
