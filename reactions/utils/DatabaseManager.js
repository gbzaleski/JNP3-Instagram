const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const DATABASE_PATH = 'db'


// SQL
const CREATE_DATABASE = `CREATE TABLE IF NOT EXISTS reactions 
                        (
                            reaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
                            post_id INTEGER,
                            username TEXT,
                            UNIQUE(username, post_id)
                        );`;

const ADD_REACTION        = `INSERT INTO reactions (post_id, username) 
                         VALUES (?, ?);`;

const DELETE_REACTION     = `DELETE FROM reactions WHERE post_id = ?
                          AND username = ?;`;

const GET_BY_POST     = 'SELECT * FROM reactions WHERE post_id = ?;';

const GET_COUNT       = 'SELECT COUNT(*) FROM reactions WHERE post_id = ?;';

const CHECK_REACTION = 'SELECT * FROM reactions WHERE post_id = ? AND username = ?;';

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

    async get_reactions(id)
    {
        return await this._db_run(GET_BY_POST, [id]);
    }

    async get_count(id)
    {
        return await this._db_run(GET_COUNT, [id]);
    }

    async add_reaction(username, post_id)
    {
        return await this._db_run(ADD_REACTION, [post_id, username]);
    }

    async delete_reaction(username, post_id)
    {
        return await this._db_run(DELETE_REACTION, [post_id, username]);
    }

    async check_reactions(post_id, username)
    {
        return await this._db_run(CHECK_REACTION, [post_id, username]);
    }
}

module.exports = DatabaseManager;
