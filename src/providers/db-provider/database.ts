import {Injectable} from "@angular/core";

import { Http, Response } from '@angular/http';
import { Observable } from "rxjs";
const DB_NAME: string = '__ionicstorage';
const win: any = window;

@Injectable()
export class Database {
    private _db: any;

    constructor(public http: Http) {
        if (win.sqlitePlugin) {
            this._db = win.sqlitePlugin.openDatabase({
                name: DB_NAME,
                location: 2,
                createFromLocation: 0
            });

        } else {
            console.warn('Storage: SQLite plugin not installed, falling back to WebSQL. Make sure to install cordova-sqlite-storage in production!');

            this._db = win.openDatabase(DB_NAME, '1.0', 'database', 5 * 1024 * 1024);
        }
        
    }

    // Initialize the DB with our required tables
    _tryInit() {
        var i:any[] = [];
        // i.push(`CREATE TABLE IF NOT EXISTS region (
		// 			idRegion INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		// 			nomRegion varchar(254) NOT NULL,
		// 			codeRegion varchar(3) NOT NULL,
		// 			coordRegionX varchar(50) DEFAULT '0',
		// 			coordRegionY varchar(50) DEFAULT NULL,
		// 			imageRegion varchar(100) NOT NULL,
        //             lastUpdate varchar(254) NOT NULL)`);

        //INIT Region
        i.forEach(element => {
            this.query(element).catch(err => {
                console.error(element);
                console.error('Storage: Unable to create initial storage tables', err.tx, err.err);
            });
        });

        
    }

    InsertJsonToDb(table:string,json:any):any{
        var p:any[]=[];
        var v:any[]=[];
        var i:any[]=[];
        for (var key in json) {
            if (json.hasOwnProperty(key)) {
                i.push('?');
                p.push(key);
                v.push(json[key]);
            }
        }

        if(p.length>0){
            var q = "INSERT OR REPLACE INTO "+table+"("+p.join(",")+") values("+i.join(",")+")";
            return this.query(q,v);
        }
        return false;

    }

    getLastSync(table:string,condition:string,callback:any) {
        this._db.transaction(
            function(tx:any) {
                
                var sql = "SELECT MAX(lastUpdate) as lastSync FROM "+table+" "+condition;
                console.log(sql)
                tx.executeSql(sql, [],

                            (tx: any, results: any) =>{
                                var lastSync = results.rows.item(0).lastSync;
                                console.log('Last local timestamp is ' + lastSync);
                                callback(lastSync);
                            },
                            (tx: any, err: any) => {
                            }
                );
            }
        );
    }

    sync(table:string,condition:string,syncCallback:any):Promise<any> {
        
        return new Promise((resolve, reject) => {
            console.log('Starting synchronization...');
            this.getLastSync(table,condition,syncCallback);
        });

    }


    getLastSync2(table:string,condition:string) {
        var data = new Observable((observer:any)=>{
        this._db.transaction((tx:any) => {
                
                var sql = "SELECT MAX(lastUpdate) as lastSync FROM "+table+" "+condition;
                console.log(sql)
                tx.executeSql(sql, [],

                            (tx: any, results: any) =>{
                                var lastSync = results.rows.item(0).lastSync;
                                console.log('Last local timestamp is ' + lastSync);
                                observer.next(lastSync)
                            },
                            (tx: any, err: any) => {
                            }
                );
            }
        );
    })
    
    return data;
    }
  

    /**
     * Perform an arbitrary SQL operation on the database. Use this method
     * to have full control over the underlying database through SQL operations
     * like SELECT, INSERT, and UPDATE.
     *
     * @param {string} query the query to run
     * @param {array} params the additional params to use for query placeholders
     * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
     */
    query(query: string, params: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this._db.transaction((tx: any) => {
                        tx.executeSql(query, params,
                            (tx: any, res: any) => resolve({ tx: tx, res: res }),
                            (tx: any, err: any) => reject({ tx: tx, err: err }));
                    },
                    (err: any) => reject({ err: err }));
            } catch (err) {
                reject({ err: err });
            }
        });
    }

    /**
     * Get the value in the database identified by the given key.
     * @param {string} key the key
     * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
     */
    get(key: string): Promise<any> {
        return this.query('select key, value from kv where key = ? limit 1', [key]).then(data => {
            if (data.res.rows.length > 0) {
                return data.res.rows.item(0).value;
            }
        });
    }

    /**
     * Set the value in the database for the given key. Existing values will be overwritten.
     * @param {string} key the key
     * @param {string} value The value (as a string)
     * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
     */
    set(key: string, value: string): Promise<any> {
        return this.query('insert or replace into kv(key, value) values (?, ?)', [key, value]);
    }

    /**
     * Remove the value in the database for the given key.
     * @param {string} key the key
     * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
     */
    remove(key: string): Promise<any> {
        return this.query('delete from kv where key = ?', [key]);
    }

    /**
     * Clear all keys/values of your database.
     * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
     */
    clear(): Promise<any> {
        return this.query('delete from kv');
    }
}