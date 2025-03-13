plugins {
    kotlin("jvm") version "1.9.25"
    kotlin("plugin.spring") version "1.9.25"
    id("org.springframework.boot") version "3.3.4"
    id("io.spring.dependency-management") version "1.1.6"
    id("org.springdoc.openapi-gradle-plugin") version "1.9.0"
    kotlin("plugin.noarg") version "2.0.21"
    kotlin("plugin.jpa") version "2.0.21"
    id("com.ncorti.ktfmt.gradle") version "0.22.0"
    id("org.jetbrains.kotlinx.kover") version "0.9.1"
}

ktfmt {
    // Google style - 2 space indentation & automatically adds/removes trailing commas
    // googleStyle()

    // KotlinLang style - 4 space indentation - From kotlinlang.org/docs/coding-conventions.html
    kotlinLangStyle()
}

noArg {
    // Jpa Entity classes should have a no-arg constructor
    annotation("javax.persistence.Entity")
}

group = "com.example"

version = "0.0.1-SNAPSHOT"

java { toolchain { languageVersion.set(JavaLanguageVersion.of(21)) } }

repositories { mavenCentral() }

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-jdbc")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa:3.3.3")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.6.0")
    implementation("org.springframework.boot:spring-boot-starter-security:3.3.0")
    implementation("io.jsonwebtoken:jjwt:0.12.6")
    implementation(kotlin("stdlib-jdk8"))
    implementation("org.postgresql:postgresql:42.7.3")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    runtimeOnly("com.h2database:h2")
    implementation("com.bucket4j:bucket4j-core:8.10.1")

    developmentOnly("org.springframework.boot:spring-boot-devtools")
}

kotlin { compilerOptions { freeCompilerArgs.addAll("-Xjsr305=strict") } }

tasks.withType<Test> { useJUnitPlatform() }
