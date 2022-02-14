const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const DATABASE_PATH = 'db'


// SQL
const CREATE_DATABASE = `CREATE TABLE IF NOT EXISTS folllows 
                        (
                            username TEXT,
                            follows TEXT,
                            UNIQUE(username, follows)
                        );`;

const ADD_FOLLOWS        = `INSERT INTO folllows (username, follows) 
                           VALUES (?, ?);`;

const GET_FOLLOWS       = 'SELECT follows FROM folllows WHERE username = ?;';

const DELETE_FOLOWS      = `DELETE FROM folllows 
                           WHERE username = ?
                           AND follows = ?;`;

const CHECK_FOLLOW   = 'SELECT * FROM folllows WHERE username = ? AND follows = ?;';                       

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

    async get_folllows(username)
    {
        return await this._db_run(GET_FOLLOWS, [username]);
    }

    async add_follows(username, follows)
    {
        return await this._db_run(ADD_FOLLOWS, [username, follows]);
    }

    async delete_follows(username, follows)
    {
        return await this._db_run(DELETE_FOLOWS, [username, follows]);
    }

    async checkfollow(username, follows)
    {
        return await this._db_run(CHECK_FOLLOW, [username, follows]);
    }
    
}

module.exports = DatabaseManager;
