CREATE SEQUENCE users_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE recipes_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE recipe_comments_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE recipe_ratings_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE users
(
    id       SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email    VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE recipes
(
    id           SERIAL PRIMARY KEY,
    title        VARCHAR(200)  NOT NULL,
    description  VARCHAR(1000) NOT NULL,
    image        VARCHAR(5000),
    ingredients  VARCHAR(500)  NOT NULL,
    cooking_time INT           NOT NULL,
    servings     INT                    DEFAULT 0,
    instructions VARCHAR(5000) NOT NULL,
    user_id      INT           NOT NULL,
    created_at   TIMESTAMP     NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE recipe_comments
(
    id         SERIAL PRIMARY KEY,
    recipe_id  INT           NOT NULL,
    user_id    INT           NOT NULL,
    message    VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP     NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_recipe FOREIGN KEY (recipe_id) REFERENCES recipes (id),
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE recipe_ratings
(
    id        SERIAL PRIMARY KEY,
    recipe_id INT         NOT NULL,
    user_id   INT         NOT NULL,
    type      VARCHAR(20) NOT NULL,
    CONSTRAINT fk_rating_recipe FOREIGN KEY (recipe_id) REFERENCES recipes (id),
    CONSTRAINT fk_rating_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT unique_recipe_user UNIQUE (recipe_id, user_id)
);

