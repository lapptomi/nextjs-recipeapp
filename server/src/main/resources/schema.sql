CREATE TABLE IF NOT EXISTS users
(
    id          SERIAL PRIMARY KEY,
    full_name   VARCHAR(255),
    username    VARCHAR(100) NOT NULL UNIQUE,
    email       VARCHAR(255) NOT NULL UNIQUE,
    provider_id VARCHAR(255)          DEFAULT NULL,
    provider    VARCHAR(255) NOT NULL DEFAULT 'credentials',
    password    VARCHAR(255),
    bio         VARCHAR(500)          DEFAULT NULL,
    image       VARCHAR(500)          DEFAULT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_followers
(
    id          SERIAL PRIMARY KEY,
    user_id     INT       NOT NULL,
    follower_id INT       NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_follower FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_follower FOREIGN KEY (follower_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT unique_user_follower UNIQUE (user_id, follower_id)
);

CREATE TABLE IF NOT EXISTS recipes
(
    id           SERIAL PRIMARY KEY,
    title        VARCHAR(200)  NOT NULL,
    description  VARCHAR(1000) NOT NULL,
    image        VARCHAR(5000),
    ingredients  VARCHAR(500)  NOT NULL,
    cooking_time INT           NOT NULL,
    servings     INT                    DEFAULT 0,
    category     VARCHAR(100),
    instructions VARCHAR(5000) NOT NULL,
    user_id      INT           NOT NULL,
    created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recipe_comments
(
    id         SERIAL PRIMARY KEY,
    recipe_id  INT           NOT NULL,
    user_id    INT           NOT NULL,
    message    VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recipe FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recipe_ratings
(
    id        SERIAL PRIMARY KEY,
    recipe_id INT         NOT NULL,
    user_id   INT         NOT NULL,
    type      VARCHAR(20) NOT NULL,
    CONSTRAINT fk_rating_recipe FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE,
    CONSTRAINT fk_rating_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT unique_recipe_user UNIQUE (recipe_id, user_id)
);
