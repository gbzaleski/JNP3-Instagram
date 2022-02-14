const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const DATABASE_PATH = 'db'


// SQL
const CREATE_DATABASE = `CREATE TABLE IF NOT EXISTS comments 
                        (
                            comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
                            post_id INTEGER,
                            content TEXT,
                            username TEXT
                        );`;

const ADD_COMMENT        = `INSERT INTO comments (post_id, content, username) 
                         VALUES (?, ?, ?);`;

const GET_BY_POST     = 'SELECT * FROM comments WHERE post_id = ?;';


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

    async get_comments(id)
    {
        return await this._db_run(GET_BY_POST, [id]);
    }

    async add_comment(username, post_id, text)
    {
        return await this._db_run(ADD_COMMENT, [post_id, text, username]);
    }
    
}

module.exports = DatabaseManager;
