export let config = {
    test: {
        PORT: 3000,
        MONGODB_URI: 'mongodb://localhost:27017/TodoAppTest',
        JWT_TOKEN_SECRET: 'afaoflfb2jeqlerlrq34q35q35qlfqlclqjlqjcql3rrq3rqrqflmsclacw9tw',
        TOKEN_LIFE: 300,
        JWT_REFRESH_TOKEN_SECRET: 'sgnoigegw4oiekwnglkn4l4nlg32ntl3jng3ljg3lgjn3gj4b34gb3edvdsv',
        REFRESH_TOKEN_LIFE: 86400,
        debug: false,
    },
    development: {
        PORT: 3000,
        MONGODB_URI: 'mongodb://localhost:27017/TodoApp',
        JWT_TOKEN_SECRET: 'popofjpfknelqwkfn392u095320lk3rl1bndwjbakjcasjbaf2e912434lj3b2',
        TOKEN_LIFE: 3600,
        JWT_REFRESH_TOKEN_SECRET: 'opkpokklwmflkweiwejpw3km4ñkmknn4eiq323r2364509098dfffbs',
        REFRESH_TOKEN_LIFE: 86400,
        DEBUG: true,
    },
};