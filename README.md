# FireStore -> SQLite Sync

> WARNING! : this package is not yet ready for production, will remove this warning when ready.

### Features

-

## Notes

- If you are updating the server data externally, make sure to update the last updated time corresponding to the collection name is updated, otherwise the change wont be automatically synced to the local sqlite db.

- in the watching-fields only `strings` and `numbers` are supported now.

- Only first level item in the collection doc is considered.

- In the local database, all the id fields (which is the primary key) is made to string, as it corresponds to DocID from firestore which is a string.
