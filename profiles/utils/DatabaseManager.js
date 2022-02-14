const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const DATABASE_PATH = 'db'


// SQL
const CREATE_DATABASE = `CREATE TABLE IF NOT EXISTS profiles 
                        (
                            username TEXT PRIMARY KEY, 
                            image TEXT,
                            bio TEXT
                        );`;

const ADD_POST        = `INSERT INTO profiles (username, image, bio) 
                         VALUES (?, ?, ?);`;

const GET_PROFILE    = `SELECT * FROM profiles WHERE username = ?`;

const UPDATE_AVATAR = `UPDATE profiles
                        SET 
                            image = ?
                        WHERE
                            username = ?;`

const UPDATE_BIO = `UPDATE profiles
                        SET 
                            bio = ?
                        WHERE
                            username = ?;`

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

    async create_profile(username, image, bio)
    {
        return await this._db_run(ADD_POST, [username, image, bio]);
    }
    
    async get_profle(username) 
    {
        return await this._db_run(GET_PROFILE, [username]);
    }

    async update_avatar(username, image) 
    {
        return await this._db_run(UPDATE_AVATAR, [image, username]);
    }

    async update_bio(username, bio) 
    {
        return await this._db_run(UPDATE_BIO, [bio, username]);
    }
}

module.exports = DatabaseManager;
