const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const crypto = require('crypto');

const DATABASE_PATH = 'db';
const TOKEN_LEN = 64;

// SQL
const CREATE_DATABASE = `CREATE TABLE IF NOT EXISTS users 
                        (
                            username TEXT PRIMARY KEY,
                            password TEXT, 
                            token    TEXT  UNIQUE
                        );`;

const ADD_USER       = `INSERT INTO users (username, password, token) 
                        VALUES (?, ?, ?);`;

const AUTH_USER      = `SELECT * 
                       FROM users 
                       WHERE 
                       username = ? AND 
                       password = ?;`;

const CHECK_TOKEN   = `SELECT username 
                       FROM users 
                       WHERE token = ?;`

const CHECK_USER    = `SELECT username 
                        FROM users 
                        WHERE username = ?;`                       

class DatabaseManager 
{
    async init_db()
    {
        this.db = await open({filename: DATABASE_PATH, 
                driver: sqlite3.Database, verbose: true});
        await this.db.run(CREATE_DATABASE);
    }

    async _db_run(cmd, args)
    {
        try 
        {
            return [{'success': 'true'}, ...await this.db.all(cmd, args)];
        } 
        catch (e) 
        {
            return [{'success': 'false'}, {'err': e}];
        }   
    }

    async get_token(username, password)
    {
        return await this._db_run(AUTH_USER, [username, password]);
    }

    async create_user(username, password)
    {
        return await this._db_run(ADD_USER, [username, password, crypto.randomBytes(TOKEN_LEN).toString('hex')]);
    }
    
    async user_by_token(token) 
    {
        return await this._db_run(CHECK_TOKEN, [token]);
    }

    async check_username(username) 
    {
        return await this._db_run(CHECK_USER, [username]);
    }
}

module.exports = DatabaseManager;
