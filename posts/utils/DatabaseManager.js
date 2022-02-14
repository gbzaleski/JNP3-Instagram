const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const DATABASE_PATH = 'db'


// SQL
const CREATE_DATABASE = `CREATE TABLE IF NOT EXISTS posts 
                        (
                            post_id INTEGER PRIMARY KEY AUTOINCREMENT,
                            username TEXT, 
                            image TEXT,
                            description TEXT
                        );`;

const ADD_POST        = `INSERT INTO posts (username, image, description) 
                         VALUES (?, ?, ?);`;

const GET_POST_ID     = 'SELECT * FROM posts WHERE post_id = ?;';

const GET_POST_USER   = `SELECT * FROM posts 
                         WHERE username = ? 
                         ORDER BY post_id DESC 
                         LIMIT ?`;

const DELETE_POST_ID  = `DELETE FROM posts 
                         WHERE post_id = ?`


class DatabaseManager 
{
    async init_db()
    {
        this.db = await open({filename: DATABASE_PATH, driver: sqlite3.Database, verbose: true});
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

    async get_post(id)
    {
        return await this._db_run(GET_POST_ID, [id]);
    }

    async create_post(username, image, description)
    {
        return await this._db_run(ADD_POST, [username, image, description]);
    }
    
    async get_posts(username, limit = 25) 
    {
        return await this._db_run(GET_POST_USER, [username, limit]);
    }

    async delete_post(id)
    {
        return await this._db_run(DELETE_POST_ID, [id]);
    }
}

module.exports = DatabaseManager;
