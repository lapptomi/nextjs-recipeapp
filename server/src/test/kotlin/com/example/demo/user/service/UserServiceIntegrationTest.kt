package com.example.demo.user.service

/*
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class UserServiceIntegrationTest {

    @Autowired private lateinit var userService: UserService
    @Autowired private lateinit var userRepository: UserRepository

    private lateinit var testUser: User
    private lateinit var testUser2: User

    @BeforeEach
    fun setup() {
        val user = userRepository.save<User>(users[0])
        val user2 = userRepository.save<User>(users[1])
        testUser = user
        testUser2 = user2
    }

    @AfterEach
    fun teardown() {
        userRepository.deleteAll()
    }

    @Test
    fun `getAll returns all users as DTOs`() {
        val result = userService.getAll()

        assertEquals(users.size, result.size)
        assertEquals(testUser.username, result[0].username)
        assertEquals(testUser2.username, result[1].username)
    }

    @Test
    fun `createUser saves a new user`() {
        assertEquals(users.size, userService.getAll().size)
        val newUser = CreateUserRequestDTO("email3", "user3", "password3")
        val createdUser = userService.createUser(newUser)

        assertEquals(newUser.username, createdUser.username)
        assertEquals(newUser.email, createdUser.email)
        assertEquals(users.size + 1, userService.getAll().size)
    }

    @Test
    fun `findUserById returns the correct user`() {
        val user = userService.findUserById(1)
        assertEquals(testUser.username, user.username)
        assertEquals(testUser.email, user.email)
    }

    @Test
    fun `findUserById throws UserNotFoundException when user does not exist`() {
        val users = userService.getAll()
        val userIds = users.map { it.id }.plus(users.size + 1).plus(users.size + 2)
        userIds.forEach {
            try {
                val user = userService.findUserById(it)
                assertEquals(it, user.id)
            } catch (e: UserNotFoundException) {
                assertEquals("User with id ${it} not found", e.message)
            }
        }
    }

    @Test
    fun `deleteUsers removes all users`() {
        assertEquals(users.size, userService.getAll().size)
        userService.deleteUsers()
        assertEquals(0, userService.getAll().size)
    }
}


 */
