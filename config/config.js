// port in local host
process.env.PORT = process.env.PORT || 3000;
// environment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// bdd url
let urlbdd;
if (process.env.NODE_ENV === 'dev') {
    urlbdd = 'mongodb://localhost:27017/mushroom_bdd';
} else {
    urlbdd = process.env.MONGO_URL;
}
process.env.URLBDD = urlbdd;
// time to expired token
process.env.TOKEN_EXPIRATION = 60 * 60 * 24 * 30;
// seed in JWT (Json web Token)
process.env.SEED = process.env.SEED || 'seed-dev'; 